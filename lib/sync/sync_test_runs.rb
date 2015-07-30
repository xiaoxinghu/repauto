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

tweak do |row|
  # puts row
  row.symbolize_keys
end

to TestRunsMongo
