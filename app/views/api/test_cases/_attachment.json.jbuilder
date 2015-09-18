json.attachment do
  json.title attachment[:title]
  json.url attachment[:source]
  json.type attachment[:type]
end
