if defined? Rails
  require "#{Rails.root}/lib/sync/utilities"
else
  require './utilities'
end

# set :benchmark, true
# set :parallel, true

MongoProject.new.each do |project|
  from Folders, "#{REPORT_ROOT}/#{project.path}/*/*"
end

counter = 0
test_runs = TestRunsInDB.new


tweak do |row|
  counter += 1
  project_path, type, time = row.to_s.split('/').last(3)

  begin
    # ignore synced ones
    fail "#{row}: allure folder does not exist" unless Pathname.new("#{row}/allure").exist?
    status_file = Pathname.new("#{row}/status.yml")
    in_progress_file = Pathname.new("#{row}/in_progress")
    path = row.relative_path_from(REPORT_ROOT).to_s
    fail "#{row}: up to date" if test_runs.is_synced? path
    r = { path: path,
          project_path: project_path,
          type: type }
    r[:start] = Time.strptime(time, '%Y-%m-%d-%H-%M-%S').to_i * 1000
    if status_file.exist?
      status = YAML.load_file(status_file)
      # return nil unless status
      fail "#{row}: reading status.yml failed" unless status
      r[:start] = status['start_time']
      r[:status] = status['status']
      r[:stop] = status['end_time'] if status['end_time']
    elsif in_progress_file.exist?
      r[:status] = 'running'
    else
      r[:status] = 'done'
    end
  rescue StandardError => e
    puts "#{e.message}" unless e.message.include? 'up to date'
    r = nil
  end
  r
end

# to TestRunsInDB
to DoingNothing

post_build do
  puts "--> #{counter} test runs synced."
end
