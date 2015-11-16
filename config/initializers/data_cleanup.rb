class DataCleanup
  extend Configuration
end

DataCleanup.configure do |config|
  # keep last 100 runs per run type
  config.keep_amount = 20
  # in days
  config.max_life = 14
  # keep the numbers
  config.keep_report = true
  config.garbage_rate = 0.1
end
