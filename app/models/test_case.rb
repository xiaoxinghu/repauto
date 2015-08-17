require 'addressable/uri'

class TestCase
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic

  def self.from(test_suite)
    where(path: /#{test_suite.path}/)
  end

  def get_att_link(attachment)
    p = Pathname.new APP_CONFIG['mount_point']
    p = p.join self[:path]
    p.dirname.join(attachment[:source]).to_s
  end

end
