class TestCase
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  belongs_to :test_run
  embeds_one :failure
  embeds_many :steps
  embeds_many :comments
  has_and_belongs_to_many :attachments, inverse_of: nil

  field :status, type: String
  field :tags, type: Array
  field :start, type: Time
  field :stop, type: Time
  field :def_id, type: BSON::ObjectId
  field :test_suite_file_id, type: BSON::ObjectId

  def definition
    TestCaseDef.find(def_id)
  end

end

class Failure
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  embedded_in :test_case

  field :message, type: String
  field :stack_trace, type: String
end

class Step
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  embedded_in :test_case
  field :status, type: String
  field :start, type: Time
  field :stop, type: Time
end

class Comment
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  include Mongoid::Timestamps
  embedded_in :test_case
  field :user, type: String
  field :comment, type: String
  field :status, type: String
end
