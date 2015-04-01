class SyncJob < ActiveJob::Base
  include Sidekiq::Worker
  queue_as :default

  def perform(*args)
    Project.sync
  end

end
