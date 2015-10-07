class DataSync
  extend Configuration
end

DataSync.configure do |config|
  config.root = Pathname.new(ENV['REPORT_ROOT'])
  config.project_pattern = "#{config.root}/*/project.yml"
  config.auto_mount = true
end
