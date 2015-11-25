json.cache! test_case do
  json.id test_case.id.to_s
  test_case_def = test_case.definition
  json.name legalize(test_case_def.name)
  json.md5 test_case_def.md5
  json.test_suite legalize(test_case_def.test_suite)
  json.steps (0...test_case.steps.size).each do |index|
    json.name legalize(test_case_def.steps[index])
    json.start test_case.steps[index].start
    json.stop test_case.steps[index].stop
    json.status test_case.steps[index].status
  end
  json.start test_case.start
  json.stop test_case.stop
  json.status test_case.status
  json.tags test_case.tags
  json.failure test_case.failure if test_case.respond_to? 'failure'
  json.comments test_case.comments if test_case.respond_to? 'comments'
  if test_case.respond_to? 'attachments'
    json.attachments test_case.attachments do |attachment|
      json.title attachment[:title]
      json.url raw_api_attachment_path(attachment)
      json.type attachment[:type]
    end
  end
end

