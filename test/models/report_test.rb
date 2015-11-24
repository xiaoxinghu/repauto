require 'test_helper'

class ReportTest < ActiveSupport::TestCase
  test "report has correct numbers" do
    test_run = create(:test_run_with_unique_test_cases)
    test_run.save! if test_run.changed?
    report = test_run.report
    assert test_run.test_cases.size == report.total
    report.original_status.each do |k, v|
      assert test_run.test_cases.where(status: k).size == v
    end
  end

  test "report number ignore re-runs" do
    test_run = create(:test_run_with_dup_test_cases)
    test_run.save! if test_run.changed?
    counter = {}
    test_run.test_cases.each do |tc|
      md5 = tc.definition.md5
      counter[md5] = tc unless counter[md5] && counter[md5].start > tc.start
    end

    assert test_run.report.total == counter.keys.size
    test_run.report.original_status.each do |k, v|
      assert counter.values.count { |x| x.status == k } == v
    end
  end
end
