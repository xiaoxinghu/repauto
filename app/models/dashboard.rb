class Dashboard

  attr_accessor :url, :name

  def initialize(settings)
    @name = settings['name']
    @url = settings['url']
  end
    

  def self.load(config)
    config.map { |c| Dashboard.new c }
  end
end
