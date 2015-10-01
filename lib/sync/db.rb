require './app/models/project'
require './app/models/raw_data'
require './app/models/test_run'

class MongoProject
  def <<(row)
    project = Project.where(path: row[:path]).first_or_create
    project.update(row)
    project.save!
  end

  def each
    Project.all.each do |p|
      yield p
    end
  end
end

class MongoTestRunRaw
  def <<(row)
    path = row.to_s
    project_path, type, time = path.split('/').last(3)
    project = Project.find_by(path: project_path)
    test_run = TestRun.where(path: path).first_or_create
    project.test_runs.push(test_run)
    grid_fs = Mongoid::GridFs
    files = Pathname.glob("#{row}/allure/*.xml")
    files.each do |file|
      puts "file: #{file.cleanpath} (#{file.size})"
      raw_data = RawData.create(
        name: file.basename,
        type: 'xml',
        size: file.size,
        tags: []
        )
      f = grid_fs.put(file)
      puts "#{f.id}, #{f.filename}"
      test_run.files = []
      test_run.files.push f
    end
    test_run.save!
  end

  def each
  end

  def synced?(path)
    TestRun.find(path: path, synced: true).count > 0
  end
end
