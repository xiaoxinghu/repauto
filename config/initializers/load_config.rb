CONFIG_PATH="#{Rails.root}/config/config.yml"
APP_CONFIG = YAML.load_file(CONFIG_PATH)[Rails.env]

MONGOID_PATH="#{Rails.root}/config/mongoid.yml"
MONGO_CONFIG = YAML.load_file(MONGOID_PATH)[Rails.env]
