class Project < Folder
  include ActiveSupport::Cache

  attr_accessor :stream, :reports, :dashboards, :meta

  def initialize(path, stream)
    super(path)
    @stream = stream
    yaml = self.class.http_get(path).body
    @meta = YAML::load(yaml)
    @reports = Report.under self
    @dashboards = Dashboard.load @meta['dashboards']
  end

  def belongs_to?(stream)
    @path.include? stream.path
  end

  def self.under(stream)
    Rails.cache.fetch("#{stream.id}/projects", expire_in: 12.hours) do
      yml_files = []
      find_files 'project.yml', stream.path, yml_files
      yml_files.map {|f| Project.new f, stream }
    end
  end

  def self.all
    projects = []
    Stream.all.each do |stream|
      projects.concat under(stream)
    end
    projects
  end

  def report(id)
    @reports.find { |r| r.id == id }
  end

end
