require 'addressable/uri'

module ApplicationHelper
  def link(path)
    Addressable::URI::join(APP_CONFIG['report_host'], path).to_s
  end

  def status_map(status)
    case status
    when "passed"
      "success"
    when "failed"
      "danger"
    when "broken"
      "warning"
    when "pending"
      "default"
    when "canceled"
      "danger"
    else
      "muted"
    end
  end

  def status_view(counts)
    status_in_order = %w(passed broken failed pending)
    total = 0
    content_tag(:div) do
      status_in_order.each do |status|
        if counts[status]
          concat content_tag(:span, counts[status], class: "label label-#{status_map(status)}")
          total += counts[status]
        end
      end
      pass_rate = counts['passed'] ? counts['passed'] * 100 / total : 0
      concat content_tag(:span, "#{pass_rate}%", class: 'label label-info')
    end
  end

  def trace_project
    if defined? @project
      return @project
    elsif defined? @test_run
      return @test_run.project
    elsif defined? @test_suite
      return @test_suite.test_run.project
    elsif defined? @test_case
      return @test_case.test_suite.test_run.project
    end
  end
end
