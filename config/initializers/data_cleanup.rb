class DataCleanup
  extend Configuration
end

DataCleanup.configure do |config|
  # keep last 100 runs per run type
  config.keep_amount = 10
  # in days
  config.max_life = 30
  # keep the numbers
  config.keep_report = true
end
