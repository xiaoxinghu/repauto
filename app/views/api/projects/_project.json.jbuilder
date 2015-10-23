json.cache! ['v1', project], expires_in: 5.minutes do
  json.id project.id.to_s
  json.name project.project
  json.stream project.stream
  json.run_names project.test_runs.distinct(:name)
end
