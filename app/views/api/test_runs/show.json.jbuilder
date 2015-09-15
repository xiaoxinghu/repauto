json.test_run do
  json.id @test_run.id.to_s
  json.path @test_run[:path]
  json.start @test_run[:start]
  json.stop @test_run[:stop]
  json.status @test_run[:status]
  json.summary @test_run[:summary]
end
