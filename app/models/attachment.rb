class Attachment
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  extend AllureHelper::AttachmentHelper
  belongs_to :test_run

  field :file_name, type: String
  field :size, type: Integer
  field :data, type: BSON::Binary
  field :tags, type: Array
  field :processed, type: Boolean, default: -> { false }
end
