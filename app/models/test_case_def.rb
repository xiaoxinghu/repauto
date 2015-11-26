require 'addressable/uri'
require 'digest'

class TestCaseDef
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  belongs_to :project

  field :name, type: String
  field :test_suite, type: String
  field :steps, type: Array
  field :md5, type: String

  attr_readonly :name, :test_suite, :steps, :md5

  before_save do |doc|
    doc.md5 = doc.gen_md5
  end

  def self.find_or_create(project, name, test_suite, steps)
    d = TestCaseDef.new(
      project: project,
      name: name,
      test_suite: test_suite,
      steps: steps)
    md5 = d.gen_md5
    match = TestCaseDef.where(md5: md5).first
    return match if match
    d.save!
    d
  end

  def gen_md5
    md5 = Digest::MD5.new
    md5 << ( project.id.to_s )
    md5 << ( name || '' )
    md5 << ( test_suite || '' )
    steps.each do |step|
      md5 << (step || '')
    end
    md5.hexdigest
  end

end
