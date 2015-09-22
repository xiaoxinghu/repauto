# json.(@test_run.summary(manual: true), 'passed', 'failed')
json.merge! @test_run.summary(manual: true)
json.todo @test_run.todo
