require "#{Rails.root}/lib/sync/providers"
require "#{Rails.root}/lib/sync/consumers"

set :benchmark, true
set :parallel, true

from TestRunsMongo

tweak do |row|
  result = row.symbolize_keys
  result = nil if row[:start] && row[:stop]
  result
end

to UpdateTestRunTime
