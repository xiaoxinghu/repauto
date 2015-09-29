class Project
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  field :project, as: :name, type: String

  def test_runs
      TestRun.from self
  end

  def run_types
    types = TestRun.where(project_path: path).distinct(:type)
    types.to_a
  end
end
