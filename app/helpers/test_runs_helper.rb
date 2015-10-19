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

  def summarize(test_run)
    summary = []
    summary << { name: 'date', value: show_date(test_run.start) }
    summary << { name: 'duration', value: show_duration(test_run.start, test_run.stop) }
    total = test_run[:summary].values.sum
    summary << { name: 'total', value: total }
    pass_rate = (test_run[:summary][:passed] || 0) * 100.0 / total
    summary << { name: 'PR', value: "#{pass_rate.round(2)}%" }
    test_run[:summary].each do |k, v|
      summary << { name: k, value: v }
    end
    summary << { name: 'todo', value: test_run.todo }
    summary
  end
end
