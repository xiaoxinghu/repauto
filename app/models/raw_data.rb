class RawData
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  belongs_to :test_run

  field :name, type: String
  field :tags, type: Array
  field :type, type: String
  field :size, type: Integer
  field :data, type: BSON::Binary
end
