FactoryGirl.define do
  factory :test_run do
    name 'test run'
    start 1.hours.ago
    stop 30.minutes.ago
    status 'done'

    factory :test_run_with_test_cases do
      name 'test run with test cases'
      transient do
        test_cases_count 5
      end

      after(:create) do |test_run, evaluator|
        create_list(:test_case, evaluator.test_cases_count, test_run: test_run)
      end
    end
  end
end
