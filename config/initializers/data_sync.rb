class DataSync
  extend Configuration
end

DataSync.configure do |config|
  config.root = Pathname.new('public/raw')
  # root/project_folder/run_type/run_instance/allure/
  config.project_pattern = "#{config.root}/*"
  # relative to project path
  config.test_run_pattern = '*/*'
  # relative to test run path
  config.allure_file_pattern = 'allure/*'
  config.archive_folder = 'allure.imported'
  config.image_size = '600x600'
  config.status_file_name = 'status.yml'
  # if exists under test run folder, do not delete
  config.keep_file_name = 'in_progress'
  config.auto_cleanup = true
  config.auto_mount = false
end
