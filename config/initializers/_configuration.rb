# basic configuration methods
module Configuration
  def configuration
    @configuration ||= ActiveSupport::OrderedOptions.new
  end

  def reset
    @configuration = ActiveSupport::OrderedOptions.new
  end

  def configure
    yield configuration
  end

end
