json.id test_case.id.to_s
json.name test_case.name
json.start test_case.start
json.stop test_case.stop
json.status test_case.status
json.path test_case.path
json.tags test_case.tags
json.steps test_case.steps if test_case.respond_to? 'steps'
json.test_suite test_case[:test_suite]
json.md5 test_case.md5 if test_case.respond_to? 'md5'
json.failure test_case.failure if test_case.respond_to? 'failure'
json.comments test_case.comments if test_case.respond_to? 'comments'
if test_case.respond_to? 'attachments'
  json.attachments test_case.attachments do |attachment|
    json.title attachment[:title]
    json.url get_att_link(test_case, attachment)
    json.type attachment[:type]
  end
end
json.url do
  json.history history_api_test_case_path(test_case)
  json.comment comment_api_test_case_path(test_case)
end

json.diff_with test_case.diff_with if test_case.respond_to? 'diff_with'
