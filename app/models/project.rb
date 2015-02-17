class Project < Folder
  include ActiveSupport::Cache

  attr_accessor :reports, :dashboards, :meta, :stream

  def initialize(path)
    super(path)
    yaml = self.class.http_get(path).body
    @meta = YAML::load(yaml)
    @reports = Report.under self
    @dashboards = Dashboard.load @meta['dashboards']
    @stream = @meta['stream']
  end

  def self.all
    Rails.cache.fetch("projects", expire_in: 12.hours) do
      yml_files = []
      find_files 'project.yml', APP_CONFIG['report_root'], yml_files, ['log', 'allure']
      yml_files.map {|f| Project.new f }
    end
  end

  def report(id)
    @reports.find { |r| r.id == id }
  end

end
