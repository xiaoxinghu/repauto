CONFIG_PATH="#{Rails.root}/config/config.yml"
APP_CONFIG = YAML.load(ERB.new(File.read(CONFIG_PATH)).result)[Rails.env]
