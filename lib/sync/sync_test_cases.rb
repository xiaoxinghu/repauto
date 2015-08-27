if defined? Rails
  require "#{Rails.root}/lib/sync/utilities"
else
  require './utilities'
end
require 'pp'

set :benchmark, true
set :parallel, true

test_runs = TestRunsInDB.new :unsynced
test_runs.each do |run|
  # next if File.exist? "#{Rails.root}/public/#{APP_CONFIG['mount_point']}/#{run[:path]}/in_progress"
  from Datacraft::Tools::AllureTestCases, "#{REPORT_ROOT}/#{run[:path]}/allure"
  test_runs.synced run
  # processed << run[:path]
end

counter = 0
stop = false
tweak do |row|
  counter += 1
  format_test_case row
  # if !stop && !row.key?(:path)
  # if !stop
  #   pp row
  #   # pp test_suite
  #   stop = true
  # end
  row
end

def format_test_suite(hash)
  return unless hash['test_suite'].key? 'path'
  test_suite = hash['test_suite']
  path = Pathname.new(test_suite['path']).relative_path_from(REPORT_ROOT).to_s
  test_suite['path'] = path
  # hash['test_suite'] = test_suite
  test_suite.format_for_report!
end

def format_test_case(hash)
  format_test_suite hash
  hash['path'] = hash['test_suite'][:path]
  format_steps hash
  format_attachments hash
  format_failure hash
  format_tags hash
  hash.format_for_report!
end

def format_steps(hash)
  return unless hash.key? 'steps'
  steps = hash.delete('steps')['step']
  steps = [steps] if steps.is_a? Hash
  steps.each(&:format_for_report!)
  hash['steps'] = steps
end

def format_attachments(hash)
  return unless hash.key? 'attachments'
  atts = hash.delete('attachments')['attachment']
  atts = [atts] if atts.is_a? Hash
  atts.each(&:format_for_report!)
  hash['attachments'] = atts
end

def format_failure(hash)
  return unless hash.key? 'failure'
  hash['failure'].format_for_report!
end

def format_tags(hash)
  return unless hash.key? 'parameters'
  params = hash.delete('parameters')['parameter']
  tags = []
  params.each do |p|
    tags << p['@value']
  end
  hash['tags'] = tags
end

to TestCasesInDB
to TestSuiteInDB
to UpdateTestRunSummary
# to DoingNothing

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
