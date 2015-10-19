require 'addressable/uri'

module ApplicationHelper
  def css_cdn_links
    [
      'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css',
      '//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css',
      'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.2/css/bootstrap3/bootstrap-switch.min.css'
    ]
  end

  def js_cdn_links
    [
      'https://code.jquery.com/jquery-2.1.4.min.js',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js',
      '//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js',
      '//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.2/js/bootstrap-switch.min.js'
    ]
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

  def active_class(controller: nil, actions: [])
    return '' if controller && controller_name != controller
    return '' unless actions.any? { |a| a == action_name }
    'active'
  end
end
