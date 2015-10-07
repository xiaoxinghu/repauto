class TestSuite
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  extend AllureHelper::TestSuiteHelper
  has_many :test_results, autosave: true
  belongs_to :test_run

  field :name, type: String
  field :file_name, type: String
  field :start, type: Time
  field :stop, type: Time
end
