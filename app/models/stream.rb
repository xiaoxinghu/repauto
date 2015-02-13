class Stream < Folder

  attr_accessor :meta, :projects

  def initialize(path)
    super(path)
    yaml = self.class.http_get(path).body
    @meta = YAML::load(yaml)
    @projects = Project.under(self)
  end

  def self.all
    Rails.cache.fetch("streams", expire_in: 12.hours) do
      streams = []
      yml_files = []
      find_files 'stream.yml', APP_CONFIG['report_root'], yml_files
      streams = yml_files.map {|f| Stream.new f }
    end
  end

  def project(id)
    @projects.find { |p| p.id == id }
  end
end
