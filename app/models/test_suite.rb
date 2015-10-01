class TestSuite
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  has_many :test_cases
  belongs_to :test_run

  def self.from(test_run)
    where(path: %r{^#{test_run.path}/})
  end

  def test_cases
    TestCase.from self
  end

end
