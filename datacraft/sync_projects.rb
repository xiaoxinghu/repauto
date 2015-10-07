require './config/environment'
require './datacraft/db'

class YamlFiles
  def initialize(pattern)
    @pattern = pattern
  end

  def each
    projects = Pathname.glob(@pattern)
    projects.each do |f|
      p = YAML.load_file(f)
      p[:path] = f.cleanpath
      yield p
    end
  end
end

# set :benchmark, true

from YamlFiles, DataSync.configuration.project_pattern

counter = 0
tweak do |row|
  counter += 1
  abs_path = Pathname.new(row[:path])
  row[:path] = abs_path.relative_path_from(DataSync.configuration.root).dirname.to_s
  row.symbolize_keys
end

to MongoProject

post_build do
  puts "--> #{counter} projects synced."
end
