class Step
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  embedded_in :test_case
  field :status, type: String
  field :start, type: Time
  field :stop, type: Time
end
