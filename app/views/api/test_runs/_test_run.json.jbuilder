json.cache! ['v1', test_run], expires_in: 5.minutes do
  json.id test_run.id.to_s
  json.name test_run.name
  json.status test_run.status if test_run.status
  json.report do
    json.original_status test_run.gen_report.original_status
    json.processed_status test_run.gen_report.processed_status
    json.todo test_run.gen_report.todo
  end
  json.start test_run.start
  json.stop test_run.stop
  json.api do
    json.detail detail_api_test_run_path(test_run)
    json.progress progress_api_test_run_path(test_run)
    if test_run[:archived_at]
      json.restore restore_api_test_run_path(test_run)
    else
      json.archive archive_api_test_run_path(test_run)
    end
  end
end
