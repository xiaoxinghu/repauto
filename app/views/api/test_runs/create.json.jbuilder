if @error
  json.status 'error'
  json.message @error.message
else
  json.status 'ok'
  json.id @test_run.id.to_s
end
