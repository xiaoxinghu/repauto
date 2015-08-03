class TestRun
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic

  def full_path
    self.project_path + self.path
  end

  def report_path
    File.join(self.full_path, 'report')
  end

  def project
    Project.where(path: project_path).first
  end

  def test_suites
    TestSuite.from self
  end

  def self.from(project)
    where(path: /#{project.path}/)
  end
end
