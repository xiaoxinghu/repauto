class Project
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  field :project, as: :name, type: String
end
