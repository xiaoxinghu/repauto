class TestRun
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  # has_many :test_suites
  # has_many :test_cases
  # has_one :project
  belongs_to :project
  has_many :raw_datas
  # paginates_per 20

  # def project
  #   Project.where(path: project_path).first
  # end

  def test_suites
    TestSuite.from self
  end

  def test_cases
    TestCase.from self
  end

  def self.from(project)
    where(path: %r{^#{project.path}/})
  end

  def todo
    test_cases.where(:status.ne => :passed).exists(comments: false).count
  end

  def summary(manual: false)
    manual ? manual_summary : self[:summary]
  end

  private

  def summary_with_passrate
    swp = self[:summary].clone
    add_pass_rate swp
  end

  def manual_summary
    return {} unless self[:summary]
    summary = self[:summary].clone
    commented = test_cases.exists(comments: true)
    commented.each do |tc|
      new_status = tc[:comments].last[:status] || tc[:status]
      old_status = tc[:status]
      if new_status != old_status
        summary[new_status] ||= 0
        summary[new_status] += 1
        summary[old_status] -= 1
      end
    end
    # add_pass_rate summary
    summary
  end


  def add_pass_rate(summary)
    passed = (summary[:passed] || 0)
    summary[:rate] = passed * 100.0 / summary.values.sum
    summary
  end
end
