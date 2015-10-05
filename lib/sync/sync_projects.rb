require "#{Rails.root}/lib/sync/utilities"

# set :benchmark, true

from YamlFiles, "#{REPORT_ROOT}/*/project.yml"

counter = 0
tweak do |row|
  counter += 1
  abs_path = Pathname.new(row[:path])
  row[:path] = abs_path.relative_path_from(REPORT_ROOT).dirname.to_s
  row.symbolize_keys
end

to MongoProject

post_build do
  puts "--> #{counter} projects synced."
end
