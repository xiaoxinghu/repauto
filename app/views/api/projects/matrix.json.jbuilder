json.array! @matrix do |tcd|
  json.name tcd[:def].name
  json.history tcd[:history] do |tc|
    json.id tc.id.to_s
    json.start tc.start
    json.stop tc.stop
    json.status tc.status
  end
end
