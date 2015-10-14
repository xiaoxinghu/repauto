class Comment
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  include Mongoid::Timestamps
  embedded_in :test_case
  field :user, type: String
  field :comment, type: String
  field :status, type: String
end
