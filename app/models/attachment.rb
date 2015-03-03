require 'addressable/uri'

class Attachment < ActiveRecord::Base
  belongs_to :test_case

  def get_link
    url = URI::join(APP_CONFIG['report_host'], self.test_case.test_suite.full_path)
    url.merge(self.source).to_s
  end
end
