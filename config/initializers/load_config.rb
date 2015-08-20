CONFIG_PATH="#{Rails.root}/config/config.yml"
APP_CONFIG = YAML.load(ERB.new(File.read(CONFIG_PATH)).result)[Rails.env]

MONGOID_PATH="#{Rails.root}/config/mongoid.yml"
MONGO_CONFIG = YAML.load(ERB.new(File.read(MONGOID_PATH)).result)[Rails.env]
