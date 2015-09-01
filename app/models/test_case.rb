require 'addressable/uri'
require 'digest'

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

  def get_md5
    return self[:md5] if self[:md5]
    md5 = Digest::MD5.new
    project, type = self[:path].split('/').select{ |s| s.length > 0 }.first(2)
    md5 << project
    md5 << type
    md5 << self[:name]
    if self[:steps]
      self[:steps].each do |step|
        md5 << step[:name]
      end
    end
    self[:md5] = md5.hexdigest
    self.save!
    self[:md5]
    # md5 = Digest::MD5.new
    # md5 << self[:name].split('_')[0]
    # if self[:steps]
    #   self[:steps].each do |step|
    #     md5 << step[:name]
    #   end
    # end
    # self[:md5] = md5.hexdigest
    # self.save!
    # self[:md5]
  end
end
