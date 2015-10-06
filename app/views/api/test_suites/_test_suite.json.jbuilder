json.id test_suite.id.to_s
json.call(test_suite, :name, :start, :stop)
json.test_cases test_suite.test_results, partial: 'api/test_results/test_result', as: :test_result
