namespace :report do
  desc 'Sync data to database, sync all projects if param project is not given'
  task :sync, [:project] => :environment do |_task, args|
    start = Time.now
    logger = Logger.new(STDOUT)
    logger.level = Rails.logger.level
    Rails.logger = logger
    logger.info 'Start Syncing...'
    Project.sync name: args[:project]
    finish = Time.now
    logger.info "Sync Finished. Started at #{start}. Took #{finish - start} seconds."
  end

  desc 'Manually sync data to database, turn off and on background sync task automatically'
  task :msync, [:project] => :environment do |_task, args|
    # turn off cron task
    `crontab -r`

    Rake::Task['report:sync'].invoke args[:project]

    # turn cron task back on
    `whenever --update-crontab`
  end

  desc 'Sync all data, this is going to be slow'
  task sync_all: :environment do
    # turn off cron task
    `crontab -r`

    start = Time.now
    logger = Logger.new(STDOUT)
    logger.level = Rails.logger.level
    Rails.logger = logger
    logger.info 'Start Syncing...'
    Project.sync deep: true
    finish = Time.now
    logger.info "Sync Finished. Started at #{start}. Took #{finish - start} seconds."

    # turn cron task back on
    `whenever --update-crontab`
  end

  desc 'testing'
  task :test, [:project, :deep] => :environment do |task, args|
    #args.with_defaults(project: 'FP5')
    puts "Hello #{args[:project]}"
    puts "Hello #{args[:deep].to_bool}"
  end
end
