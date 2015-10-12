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
end
