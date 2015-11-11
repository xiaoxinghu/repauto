json.cache! ['v1', test_run], expires_in: 5.minutes do
  json.id test_run.id.to_s
  json.name test_run.name
  json.status test_run.status if test_run.status
  report = Report.of(test_run)
  json.report do
    json.original_status report.original_status
    json.processed_status report.processed_status
    json.todo report.todo
  end
  json.start test_run.start
  json.stop test_run.stop
end
