class Report < Folder

  attr_accessor :tags, :url, :date, :project

  def initialize(path, project)
    super(path)
    @url = URI::join(APP_CONFIG['report_host'], @path).to_s
    @tags = path.split('/').reject!{ |t| t.strip.empty? || t == APP_CONFIG['report_root'] }
    @date = get_date
    @project = project
  end

  # def self.under(project)
  #   Rails.cache.fetch("#{project.id}/reports", expire_in: 12.hours) do
  #     reports = []
  #     puts "get reports for project #{project.name} under #{project.path}"
  #     get_reports(project.path, reports, project)
  #     reports
  #   end
  # end

  def self.under(project)
    Rails.cache.fetch("#{project.id}/reports", expire_in: 12.hours) do
      reports = []
      report_paths = []
      find_title('Allure Dashboard', project.path, report_paths, ['log', 'allure'])
      reports = report_paths.map{|path| Report.new(path, project)}
    end
  end

end
