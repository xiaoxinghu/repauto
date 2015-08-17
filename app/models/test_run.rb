class TestRun
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic

  def project
    Project.where(path: project_path).first
  end

  def test_suites
    TestSuite.from self
  end

  def test_cases
    TestCase.from self
  end

  def self.from(project)
    where(path: %r{^#{project.path}/})
  end

  def summary_with_passrate
    swp = self[:summary].clone
    passed = (swp[:passed] || 0)
    swp[:rate] = passed * 100.0 / swp.values.sum
    swp
  end
end
