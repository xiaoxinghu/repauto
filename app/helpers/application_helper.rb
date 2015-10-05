require 'addressable/uri'

module ApplicationHelper
  def link(path)
    Addressable::URI::join(APP_CONFIG['report_host'], path).to_s
  end

  def status_map(status)
    case status
    when 'passed'
      'success'
    when 'failed'
      'danger'
    when 'broken'
      'warning'
    when 'pending'
      'muted'
    when 'canceled'
      'danger'
    when 'rate'
      'info'
    else
      'muted'
    end
  end

  def status_view(counts, no_rate: false)
    status_in_order = %w(passed broken failed pending)
    total = 0
    content_tag(:div) do
      status_in_order.each do |status|
        if counts[status]
          concat content_tag(:span, counts[status], class: "label label-#{status_map(status)}")
          total += counts[status]
        end
      end
      unless no_rate
        pass_rate = counts['passed'] ? counts['passed'] * 100.0 / total : 0
        pass_rate = pass_rate.round 1
        concat content_tag(:span, "#{pass_rate}%", class: 'label label-info')
      end
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

  def show_time(time)
    Time.at(time.to_i / 1000.0).strftime('%H:%M:%S')
  end

  def show_date(time)
    Time.at(time.to_i / 1000.0).strftime('%a, %b %d %Y')
  end

  def show_datetime(time)
    Time.at(time.to_i / 1000.0).strftime('%a, %b %d %Y %H:%M:%S')
  end

  def show_duration(start, stop)
    distance_of_time_in_words((stop.to_i / 1000.0),
                              (start.to_i / 1000.0))
  end

  def active_class(controller: nil, actions: [])
    return '' if controller && controller_name != controller
    return '' unless actions.any? { |a| a == action_name }
    'active'
  end

  def spinner
    content_tag(:div, '', class: 'fa fa-spinner fa-pulse fa-3x spinner')
  end

  def say_hello
    puts 'hello world'
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
