class Project
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  has_many :test_runs, dependent: :delete
  has_many :test_case_defs, dependent: :delete

  # field :path, type: String

  # def run_types
  #   test_runs.exists(archived_at: false).distinct('type')
  # end
end
