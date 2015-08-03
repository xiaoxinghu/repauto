module TestRunsHelper
  class ActiveSupport::Duration
    def human
      s = value
      m = (s/ 60).floor
      s = s % 60
      h = (m / 60).floor
      m = m % 60
      d = (h / 24).floor
      h = h % 24

      output = ''
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

  def categories(test_runs)
    categories = test_runs.map {|report| report.name }
    categories.to_set
  end

  def date_filter
    [ 24.hours, 48.hours, 7.days, 14.days ]
  end

  def duration_filter
    [30.minutes, 1.hours, 5.hours]
  end

  def number_filter
    [5, 10, 50, 100, 200, 300]
  end

  # def filter_by_category(test_runs, category)
  #   if category.blank?
  #     test_runs
  #   else
  #     test_runs.select {|test_run| test_run.name == category }
  #   end
  # end

  # def filter_by_date(test_runs, seconds)
  #   if seconds.blank?
  #     test_runs
  #   else
  #     test_runs.select {|test_run| test_run.start > seconds.to_i.seconds.ago}
  #   end
  # end

  # def filter_by_duration(test_runs, duration)
  #   if duration.blank?
  #     test_runs
  #   else
  #     test_runs.select { |tr| (tr.end - tr.start) > duration.to_i }
  #   end
  # end

  # def filter_by_number(test_runs, number)
  #   if number.blank?
  #     test_runs
  #   else
  #     test_runs.select { |tr| tr.count > number.to_i }
  #   end
  # end

  # def filter_test_runs(test_runs, category, seconds, duration, number)
  #   filtered = filter_by_category test_runs, category
  #   filtered = filter_by_date filtered, seconds
  #   filtered = filter_by_duration filtered, duration
  #   filtered = filter_by_number filtered, number
  #   filtered.select { |tr| tr.start and tr.end }
  # end

  def context(status)
    case status
    when "passed"
      "success"
    when "failed"
      "danger"
    when "broken"
      "warning"
    else
      "muted"
    end
  end

  def context_color(status)
    case status
    when "passed"
      color = '#3c763d'
      bcolor = '#dff0d8'
    when "failed"
      color = '#a94442'
      bcolor = '#f2dede'
    when "broken"
      color = '#8a6d3b'
      bcolor = '#fcf8e3'
    else
      color = '#gray'
      bcolor = '#white'
    end
    color
  end

  def context_bcolor(status)
    case status
    when "passed"
      color = '#3c763d'
      bcolor = '#dff0d8'
    when "failed"
      color = '#a94442'
      bcolor = '#f2dede'
    when "broken"
      color = '#8a6d3b'
      bcolor = '#fcf8e3'
    else
      color = '#gray'
      bcolor = '#white'
    end
    bcolor
  end

  def to_tree(test_run)
    raw_data = {
      start: test_run.start,
      stop: test_run.stop,
      test_suites: [] }
    TestSuite.from(test_run).each do |ts|
      test_suite = { name: ts.name, test_cases: [] }
      TestCase.from(ts).each do |tc|
        test_case = { name: tc.name, id: tc.id.to_s }
        test_suite[:test_cases] << test_case
      end
      raw_data[:test_suites] << test_suite
    end
    raw_data.to_json
  end

end
