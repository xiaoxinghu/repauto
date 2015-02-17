module ReportsHelper

  class ActiveSupport::Duration
    def human
      s = value
      m = (s/ 60).floor
      s = s % 60
      h = (m / 60).floor
      m = m % 60
      d = (h / 24).floor
      h = h % 24

      output = "Last "
      output << "#{d} days" if d > 0
      output << "#{h} hours" if h > 0
      output << "#{m} minutes" if m > 0
      output << "#{s} seconds" if s > 0
      return output
    end
  end

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

  def categories(reports)
    categories = reports.map {|report| report.tags[2] }
    categories.to_set
  end

  def date_filter
    scopes = []
    scopes << 24.hours
    scopes << 48.hours
    scopes << 7.days
    scopes << 14.days
  end

  def filter_by_category(reports, category)
    if category.blank?
      reports
    else
      reports.select {|report| report.tags.include? category }
    end
  end

  def filter_by_date(reports, seconds)
    if seconds.blank?
      reports
    else
      reports.select {|report| report.date > seconds.to_i.seconds.ago}
    end
  end

  def filter(reports, category, seconds)
    filtered = filter_by_category reports, category
    filtered = filter_by_date filtered, seconds
    filtered
  end

end
