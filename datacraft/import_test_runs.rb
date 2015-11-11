require './config/environment'
require './datacraft/model_plugins/project_plugin'
require './datacraft/model_plugins/test_run_plugin'

set :benchmark, true

class TestRunFolders
  def each
    Project.all.each do |project|
      project.scan_for_test_runs.each do |folder|
        yield folder
      end
    end
  end
end

class TestRunFolder
  def initialize(folder)
    @folder = folder
  end

  def each
    yield @folder
  end
end

class TestRunData
  def <<(row)
    TestRun.import row
  end
end

# from TestRunFolders

# to enable parallel
Project.all.each do |project|
  project.scan_for_test_runs.each do |folder|
    from TestRunFolder, folder
  end
end


tweak do |row|
  valid, message = TestRun.check(row)
  puts "#{row}: #{message}" if message
  valid ? row : nil
end

to TestRunData
