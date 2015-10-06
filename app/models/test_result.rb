class TestResult
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  extend AllureHelper::TestResultHelper
  belongs_to :test_suite
  embeds_one :failure
  embeds_many :step_results
  embeds_many :comments
  has_and_belongs_to_many :attachments, inverse_of: nil

  field :status, type: String
  field :tags, type: Array
  field :start, type: Time
  field :stop, type: Time
  field :test_case_id, type: BSON::ObjectId

  def definition
    TestCase.find(test_case_id)
  end

end

class Failure
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  embedded_in :test_result

  field :message, type: String
  field :stack_trace, type: String
end

class StepResult
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  embedded_in :test_result
  field :index, type: Integer
  field :status, type: String
  field :start, type: Time
  field :stop, type: Time
end

class Comment
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  include Mongoid::Timestamps
  embedded_in :test_result
  field :user, type: String
  field :comment, type: String
  field :status, type: String
end
