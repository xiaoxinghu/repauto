require "#{Rails.root}/lib/sync/utilities"
require './config/environment'

set :benchmark, true
set :parallel, true

MongoProject.new.each do |project|
  from Folders, "#{REPORT_ROOT}/#{project.path}/*/*"
end

tweak do |row|
  project_path, type, time = row.to_s.split('/').last(3)

  begin
    fail "#{row}: allure folder does not exist" unless Pathname.new("#{row}/allure").exist?
    time = Time.strptime(time, '%Y-%m-%d-%H-%M-%S').to_i * 1000
  rescue StandardError => e
    puts "#{e.message}" unless e.message.include? 'up to date'
    row = nil
  end
  row
end

to MongoTestRunRaw
