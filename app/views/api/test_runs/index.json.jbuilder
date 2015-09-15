json.test_runs @test_runs do |test_run|
  json.id test_run[:id].to_s
  json.type test_run[:type]
  json.start test_run[:start]
  json.stop test_run[:stop]
  json.summary test_run[:summary]
  json.url test_run_path(test_run)
  json.progress_url progress_api_test_run_path(test_run)
end

json.meta do
  json.current_page @test_runs.current_page
  json.next_page @test_runs.next_page
  json.prev_page @test_runs.prev_page
  json.total_pages @test_runs.total_pages
  json.total_count @test_runs.total_count
end
