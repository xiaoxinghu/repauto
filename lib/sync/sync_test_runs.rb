require "#{Rails.root}/lib/sync/providers"
require "#{Rails.root}/lib/sync/consumers"

set :benchmark, true
set :parallel, true

# pre_build do
#   Mongo::Logger.logger.level = Logger::WARN
# end

projects = ProjectsMongo.new
projects.each do |project|
  from TestRunsHttp, project[:path]
end

counter = 0
tweak do |row|
  counter += 1
  row.symbolize_keys
end

to TestRunsMongo

post_build do
  puts "--> #{counter} test runs synced."
end
