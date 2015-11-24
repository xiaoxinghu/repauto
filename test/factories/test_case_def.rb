FactoryGirl.define do
  factory :test_case_def do
    factory :unique_test_case_def do
      name { SecureRandom.hex(10) }
      steps { [ Faker::Lorem.sentence, Faker::Lorem.sentence, Faker::Lorem.sentence ] }
    end
  end
end
