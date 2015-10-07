require 'addressable/uri'
require 'digest'

class TestCase
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  extend AllureHelper::TestCaseHelper
  belongs_to :project

  field :name, type: String
  field :steps, type: Array
  field :md5, type: String
end
