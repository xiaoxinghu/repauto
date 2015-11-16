require 'test_helper'

class TestRunTest < ActiveSupport::TestCase
  test "auto gen report" do
    test_run = create(:test_run_with_test_cases)
    test_run.save! if test_run.changed?
    report = test_run.report
    assert test_run.test_cases.size == report.total
    report.original_status.each do |k, v|
      assert test_run.test_cases.where(status: k).size == v
    end
  end
end
