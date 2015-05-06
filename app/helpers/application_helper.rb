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

  def consolidate_button
    tooltip = 'Test results where failures due to network related issues have been replaced with a tests last genuine result from last 5 test runs.'
    link_to 'Rolling Average',
            url_for(params.merge(consolidate: true)),
            id: 'consolidate',
            class: 'btn btn-primary navbar-btn ladda-button pull-right',
            type: 'button',
            title: tooltip, 'data-toggle': 'tooltip', 'data-placement': 'left',
            'data-style': 'zoom-in'
  end

  def confirmation(to, id)
    content_tag(:div,
                class: 'modal fade',
                id: id, tabindex: '-1',
                role: 'dialog',
                'aria-labelledby': 'confirmModalLabel',
                'aria-hidden': 'true') do
      content_tag(:div, class: 'modal-dialog') do
        content_tag(:div, class: 'modal-content') do
          concat(content_tag(:div, class: 'modal-header') do
                   content_tag(:h4, 'Warning', class: 'modal-title')
                 end)
          concat(content_tag(:div, class: 'modal-body') do
                   'Are you sure you want to delete this test run?'
                 end)
          concat(content_tag(:div, class: 'modal-footer') do
                   concat(content_tag(:button, 'Cancel',
                                      class: 'btn btn-default',
                                      'data-dismiss': 'modal'))
                   concat(link_to('Yes', to, class: 'btn btn-primary'))
                 end)
        end
      end
    end
  end
end
