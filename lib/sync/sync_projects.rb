require "#{Rails.root}/lib/sync/providers"
require "#{Rails.root}/lib/sync/consumers"

set :benchmark, true

from ProjectsHttp

counter = 0
tweak do |row|
  counter += 1
  row.symbolize_keys
end

to ProjectsMongo

post_build do
  puts "--> #{counter} projects synced."
end
