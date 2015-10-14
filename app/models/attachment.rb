class Attachment
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  belongs_to :test_run

  field :file_name, type: String
  field :type, type: String
  field :size, type: Integer
  field :data, type: BSON::Binary
  field :processed, type: Boolean, default: -> { false }
end
