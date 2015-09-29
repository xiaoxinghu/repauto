@changes.each do |key, value|
  json.set! key do
    json.partial! 'api/test_cases/test_case', collection: value, as: :test_case
  end
end
