class Report
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  embedded_in :test_run
  field :original_status, type: Hash
  field :processed_status, type: Hash
  field :todo, type: Integer

  def self.of(test_run)
    return test_run.report if test_run.report? && !test_run.dirty
    gen(test_run)
    test_run.report
  end

  private

  def self.gen(test_run)
    ori = {}
    pro = {}
    todo = 0
    total = 0
    test_run.test_cases.each do |tc|
      ori[tc.status] ||= 0
      ori[tc.status] += 1
      ps = tc.processed_status
      pro[ps] ||= 0
      pro[ps] += 1
      todo += 1 if tc.status != 'passed' && !tc.has_comments?
      total += 1
    end
    report = test_run.report
    report.original_status = ori
    report.processed_status = pro
    report.todo = todo
    test_run.dirty = false
    test_run.save!
  end
end
