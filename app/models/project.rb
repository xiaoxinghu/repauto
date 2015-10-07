class Project
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  has_many :test_runs
  has_many :test_cases

  field :path, type: String

  def run_types
    test_runs.exists(archived_at: false).distinct('type')
  end
end
