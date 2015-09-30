json.cache! ['v1', @test_run], expires_in: 10.minutes do
  json.partial! 'api/test_cases/test_case', collection: @test_cases, as: :test_case
end
