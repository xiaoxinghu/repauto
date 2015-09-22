json.test_runs @test_runs do |test_run|
  json.partial! 'test_run', test_run: test_run
end


json.meta do
  json.current_page @test_runs.current_page
  json.next_page @test_runs.next_page
  json.prev_page @test_runs.prev_page
  json.total_pages @test_runs.total_pages
  json.total_count @test_runs.total_count
end
