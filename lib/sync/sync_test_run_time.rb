if defined? Rails
  require "#{Rails.root}/lib/sync/utilities"
else
  require './utilities'
end

# set :benchmark, true
# set :parallel, true

from TestRunsInDB

tweak do |row|
  result = row.symbolize_keys
  result = nil if row[:start] && row[:stop]
  result
end

to UpdateTestRunTime
# to DoingNothing
