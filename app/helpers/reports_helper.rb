module ReportsHelper
  # def tags(reports)
  #   tags = []
  #   reports.each do |report|
  #     tags.concat report.tags
  #   end
  #   tags.to_set
  # end

  def tags(reports, level = -1)
    tags = []
    reports.each do |report|
      if level >= 0
        tags << report.tags[level]
      else
        tags.concat report.tags
      end
    end
    tags.to_set
  end

  def date_scopes
    scopes = []
    scopes << 24.hours
  end

end
