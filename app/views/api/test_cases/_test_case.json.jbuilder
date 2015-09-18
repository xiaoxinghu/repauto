json.test_case do
  json.id test_case.id.to_s
  json.name test_case.name
  json.start test_case.start
  json.stop test_case.stop
  json.status test_case.status
  json.path test_case.path
  json.tags test_case.tags
  json.md5 test_case.md5 if test_case.respond_to? 'md5'
  json.failure test_case.failure if test_case.respond_to? 'failure'
  if test_case.respond_to? 'attachments'
    json.attachments test_case.attachments do |attachment|
      json.title attachment[:title]
      json.url attachment[:source]
      json.type attachment[:type]
    end
  end
end
