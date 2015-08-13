require "#{Rails.root}/lib/sync/providers"
require "#{Rails.root}/lib/sync/consumers"

set :benchmark, true
set :parallel, true

start_time = Time.now

processed = []
test_runs = TestRunsMongo.new
test_runs.each do |run|
  # next if File.exist? "#{Rails.root}/public/#{APP_CONFIG['mount_point']}/#{run[:path]}/in_progress"
  from TestCaseHttp, run[:path]
  test_runs.synced run
  # processed << run[:path]
end

last_run = ''
counter = 0
tweak do |row|
  counter += 1
  row.symbolize_keys!
  if last_run != row[:path]
    last_run = row[:path]
  end
  row
end

to TestCasesMongo
to TestSuiteMongo
to UpdateTestRunSummary

post_build do
  puts "#{counter} test cases synced."
end

# post_build do
#   puts processed.size
#   processed.each do |run|
#     test_runs.set_status run, 'done'
#   end
#   puts "Done. [#{Time.now - start_time}]"
# end
