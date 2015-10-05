class Project
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  has_many :test_runs
  has_many :test_cases

  field :path, type: String
  # field :project, as: :name, type: String
  #
  # def test_runs
  #     TestRun.from self
  # end

  def run_types
    types = TestRun.where(project_path: path).distinct(:type)
    types.to_a
  end
end
