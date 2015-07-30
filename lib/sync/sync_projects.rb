require "#{Rails.root}/lib/sync/providers"
require "#{Rails.root}/lib/sync/consumers"

set :benchmark, true

from ProjectsHttp

tweak do |row|
  row.symbolize_keys
end

to ProjectsMongo
