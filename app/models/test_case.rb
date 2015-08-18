require 'addressable/uri'

class TestCase
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic

  def self.from(parent)
    where(path: %r{^#{parent.path}})
  end

  def get_att_link(attachment)
    p = Pathname.new APP_CONFIG['mount_point']
    p = p.join self[:path]
    p.dirname.join(attachment[:source]).to_s
  end

end
