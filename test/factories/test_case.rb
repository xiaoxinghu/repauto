FactoryGirl.define do
  factory :test_case do
    start { 1.hours.ago }
    stop { 30.minutes.ago }
    status { [ 'passed', 'failed', 'broken', 'pending' ].sample }
  end
end
