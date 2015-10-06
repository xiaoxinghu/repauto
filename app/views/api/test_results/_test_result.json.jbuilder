json.id test_result.id.to_s
test_case = test_result.definition
json.name test_case.name
json.start test_result.start
json.stop test_result.stop
json.status test_result.status
json.tags test_result.tags
json.steps test_result.steps if test_result.respond_to? 'steps'
json.failure test_result.failure if test_result.respond_to? 'failure'
json.comments test_result.comments if test_result.respond_to? 'comments'
if test_result.respond_to? 'attachments'
  json.attachments test_result.attachments do |attachment|
    json.title attachment[:title]
    json.url raw_api_attachment_path(attachment)
    json.type attachment[:type]
  end
end
json.api do
  json.history history_api_test_result_path(test_result)
  # json.comment comment_api_test_result_path(test_result)
end
