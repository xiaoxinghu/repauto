FactoryGirl.define do
  factory :test_case do
    start { 1.hours.ago }
    stop { 30.minutes.ago }
    status { [ 'passed', 'failed', 'broken', 'pending' ].sample }

    factory :test_case_with_unique_def do
      after(:create) do |test_case, evaluator|
        tcd = create(:unique_test_case_def)
        tcd.save!
        test_case.def_id = tcd.id
        test_case.save!
      end
    end
  end
end
