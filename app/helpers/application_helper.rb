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
    when "canceled"
      "danger"
    else
      "muted"
    end
  end
end
