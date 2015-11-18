Apipie.configure do |config|
  config.app_name                = "Repauto"
  config.api_base_url            = "/api"
  config.doc_base_url            = "/api/doc"
  config.app_info = 'Repauto Restful API doc.'
  config.markup = Markup::Markdown.new
  config.process_params = true
  # where is your API defined?
  config.api_controllers_matcher = "#{Rails.root}/app/controllers/api/*.rb"
end
