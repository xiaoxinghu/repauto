class Report
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  embedded_in :test_run
  field :original_status, type: Hash
  field :processed_status, type: Hash
  field :total, type: Integer
  field :todo, type: Integer

  def self.gen(test_run)
    ori = {}
    pro = {}
    todo = 0
    total = 0
    grouped = test_run.test_cases.group_by { |tc| tc.definition.md5 }
    grouped.each do |k, v|
      tc = v.max_by(&:start)
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
    report.total = total
    report
  end
end
