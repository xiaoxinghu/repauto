json.id test_run[:id].to_s
json.type test_run[:type]
json.start test_run[:start]
json.stop test_run[:stop]
json.summary test_run[:summary]
json.todo test_run.todo
json.url do
  json.detail test_run_path(test_run)
  json.progress progress_api_test_run_path(test_run)
  if test_run[:archived_at]
    json.restore restore_api_test_run_path(test_run)
  else
    json.archive archive_api_test_run_path(test_run)
  end
end
