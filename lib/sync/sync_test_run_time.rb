require "#{Rails.root}/lib/sync/providers"
require "#{Rails.root}/lib/sync/consumers"

set :benchmark, true
set :parallel, true

from TestRunsMongo

tweak do |row|
  result = row.symbolize_keys
  if row[:start] && row[:stop]
    puts "ignore row #{row}"
    result = nil
  end
  result
end

to UpdateTestRunTime
