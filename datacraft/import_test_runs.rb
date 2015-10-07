require './config/environment'
require './datacraft/db'

set :benchmark, true
set :parallel, true

class Folders
  def initialize(pattern)
    @folders = Pathname.glob(pattern).select(&:directory?)
  end

  def each
    @folders.each do |folder|
      yield folder
    end
  end
end

MongoProject.new.each do |project|
  from Folders, "#{DataSync.configuration.root}/#{project.path}/*/*"
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
