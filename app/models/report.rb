class Report < Folder

  attr_accessor :tags, :url, :date, :project

  def initialize(path, project)
    super(path)
    @url = URI::join(APP_CONFIG['report_host'], @path).to_s
    @tags = path.split('/').reject!{ |t| t.strip.empty? || t == APP_CONFIG['report_root'] }
    @date = Date.parse @name
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
    Rails.cache.fetch("#{project.stream.id}/#{project.id}/reports", expire_in: 12.hours) do
      reports = []
      get_reports(project.path, reports, project)
      reports
    end
  end

  def self.all
    Rails.cache.fetch("#{@project.stream.id}/@#{@project.id}/reports", expire_in: 12.hours) do
      reports = []
      get_reports(APP_CONFIG['report_root'], reports)
      reports
    end
  end

  def self.get_reports(path, reports, project)
    html_doc = html(path)
    return if html_doc.css('title').size == 0
    if html_doc.css('title')[0].text.include? 'Allure Dashboard'
      reports << Report.new(path, project)
    else
      html_doc.css('a').each do |link|
        if link.text.include? 'Parent'
          next
        end
        get_reports(link['href'], reports, project)
      end
    end
  end

end
