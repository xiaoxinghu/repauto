FactoryGirl.define do
  factory :test_run do
    name 'test run'
    start 1.hours.ago
    stop 30.minutes.ago
    status 'done'

    factory :test_run_with_unique_test_cases do
      name 'test run with unique test cases'
      transient do
        test_cases_count 5
      end

      after(:create) do |test_run, evaluator|
        create_list(:test_case_with_unique_def, evaluator.test_cases_count, test_run: test_run)
      end
    end

    factory :test_run_with_dup_test_cases do
      name 'test run with dup test cases'
      transient do
        test_cases_count 5
      end

      after(:create) do |test_run, evaluator|
        tcd_count = evaluator.test_cases_count / 2
        tcds = create_list(:unique_test_case_def, tcd_count)
        evaluator.test_cases_count.times do
          create(:test_case, def_id: tcds.sample.id, test_run: test_run)
        end
      end
    end

  end
end
