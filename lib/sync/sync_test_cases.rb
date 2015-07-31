require "#{Rails.root}/lib/sync/providers"
require "#{Rails.root}/lib/sync/consumers"

set :benchmark, true
set :parallel, true

start_time = Time.now

processed = []
test_runs = TestRunsMongo.new
test_runs.each 'in progress' do |run|
  if File.exist? "#{Rails.root}/public/#{APP_CONFIG['mount_point']}/#{run[:path]}/in_progress"
    puts "#{run[:path]} still running."
    next
  end
  from TestCaseHttp, run[:path]
  processed << run[:path]
end

last_run = ''
tweak do |row|
  # params = row.delete('parameters')
  # row['parameters'] = params['parameter']
  row.symbolize_keys!
  if last_run != row[:path]
    last_run = row[:path]
  end
  row
end

to TestCasesMongo
to TestSuiteMongo
to UpdateTestRunSummary
to UpdateTestRunTime

post_build do
  puts processed.size
  processed.each do |run|
    test_runs.set_status run, 'done'
  end
  puts "Done. [#{Time.now - start_time}]"
end
