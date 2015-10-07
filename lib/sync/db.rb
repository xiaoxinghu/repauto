require './config/environment'

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
    done = false
    path = row.to_s
    project_path, type, sn = path.split('/').last(3)
    puts "#{project_path}, #{type}, #{sn}"
    status_file = Pathname.new("#{row}/status.yml")
    in_progress_file = Pathname.new("#{row}/in_progress")
    project = Project.find_by(path: project_path)
    # test_run = TestRun.where(path: path).first_or_create
    test_run = TestRun.where(project: project, type: type, sn: sn).first_or_create
    if status_file.exist?
      status = YAML.load_file(status_file)
      done = (status[:status] == 'done')
      test_run.status = status
    end
    done = (row.mtime < 10.minutes.ago) unless in_progress_file.exist?
    project.test_runs.push(test_run)
    files = Pathname.glob("#{row}/allure/*")
    files.each do |file|
      unless Attachment.imported? file
        attachment = Attachment.from_file file
        test_run.attachments.push attachment
      end
      file.delete
    end
    test_run.save!
    # delete folder if done
    FileUtils.rm_r row if done
  end
end

class MongoTestSuiteToProcess
  def each
    Attachment
      .where(tags: 'testsuite')
      .where(processed: false)
      .each do |a|
      yield a
    end
  end
end

class MongoTestSuite
  def <<(row)
    TestSuite.parse row
    row.processed = true
    row.save!
  end
end
