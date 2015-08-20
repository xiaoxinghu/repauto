require 'uri'
require 'datacraft'
require 'sync/consumers'

namespace :report do
  desc 'Sync data to database, sync all projects if param project is not given'
  task :sync, [:project] => [:environment, :mount] do |_task, args|
    start = Time.now
    logger = Logger.new(STDOUT)
    logger.level = Rails.logger.level
    Rails.logger = logger
    logger.info 'Start Syncing...'
    insts = ['sync_projects.rb',
             'sync_test_runs.rb',
             'sync_test_cases.rb',
             'sync_test_run_time.rb']
    insts.each do |i|
      puts "running instruction #{i}..."
      inst = Datacraft::Instruction.from_file "#{Rails.root}/lib/sync/#{i}"
      Datacraft.run inst
    end
    # insts.each { |inst| Datacraft.run inst }
    finish = Time.now
    logger.info "Sync Finished.
    Started at #{start}. Took #{finish - start} seconds."
  end

  desc 'Manually sync data to database,
  turn off and on background sync task automatically'
  task :msync, [:project] => :environment do |_task, args|
    # turn off cron task
    `crontab -r`

    Rake::Task['report:sync'].invoke args[:project]

    # turn cron task back on
    `whenever --update-crontab`
  end

  desc 'Mount the samba share'
  task mount: :environment do
    username = APP_CONFIG['username']
    password = URI.escape APP_CONFIG['password'], '!'
    dest = Pathname.new("#{Rails.root}/public/#{APP_CONFIG['mount_point']}").cleanpath.to_s
    cmd = "mount -t smbfs smb://#{username}:#{password}@#{APP_CONFIG['report_host']}/#{APP_CONFIG['report_path']} #{dest}"
    output = `mount | grep #{dest}`
    if output.empty?
      puts 'smb is not mounted, mounting ...'
      `#{cmd}`
    end
  end

  desc 'testing'
  task test: :environment do
    # insts = ['sync_test_run_time.rb']
    # insts.each do |i|
    #   puts "running instruction #{i}..."
    #   inst = Datacraft::Instruction.from_file "#{Rails.root}/lib/sync/#{i}"
    #   Datacraft.run inst
    # end
    # password = URI.escape APP_CONFIG['password'], '!'
    puts "#{APP_CONFIG['report_host']}"
    puts "#{APP_CONFIG['report_path']}"
    puts "#{APP_CONFIG['mount_point']}"
    puts "#{APP_CONFIG['username']}"
    puts "#{APP_CONFIG['password']}"
  end
end
