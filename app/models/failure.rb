class Failure
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  embedded_in :test_case

  field :message, type: String
  field :stack_trace, type: String
end
