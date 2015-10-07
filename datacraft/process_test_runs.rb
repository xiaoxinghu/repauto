require './config/environment'
require './datacraft/db'

set :benchmark, true
set :parallel, true

from MongoTestSuiteToProcess

tweak do |row|
  puts row.file_name
  row
end

to MongoTestSuite
