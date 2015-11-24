require 'test_helper'

class TestRunTest < ActiveSupport::TestCase
  test "auto gen report" do
    test_run = create(:test_run_with_unique_test_cases)
    test_run.save! if test_run.changed?
    report = test_run.report
    assert report
  end
end
