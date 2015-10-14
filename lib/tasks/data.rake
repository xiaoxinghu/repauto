require 'uri'
require 'datacraft'

namespace :data do
  desc 'Sync data to database, sync all projects if param project is not given'
  task :sync_old, [:project] => [:environment, :mount] do |_task, args|
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

    Rake::Task['data:sync'].invoke args[:project]

    # turn cron task back on
    `whenever --update-crontab`
  end

  desc 'Sync'
  task sync: [:environment, :mount, :import, :process] do
  end

  desc 'Mount the samba share'
  task mount: :environment do
    next unless DataSync.configuration.auto_mount
    next unless username = ENV['USERNAME']
    next unless password = URI.escape(ENV['PASSWORD'], '!')
    next unless host = ENV['REPORT_HOST']
    next unless path = ENV['REPORT_PATH']
    dest = DataSync.configuration.root.cleanpath.to_s
    cmd = "mount -t smbfs smb://#{username}:#{password}@#{host}/#{path} #{dest}"
    output = `mount | grep #{dest}`
    if output.empty?
      puts 'smb is not mounted, mounting ...'
      `#{cmd}`
    end
  end

  desc 'import raw data into database'
  task import: :environment do
    tasks = ['datacraft/sync_projects.rb', 'datacraft/import_test_runs.rb']
    tasks.each do |task|
      script = IO.read(task)
      puts "#{Time.now} -> #{task}"
      instruction = Datacraft.parse(script)
      Datacraft.run instruction
    end
  end

  desc 'process allure results'
  task process: :environment do
    tasks = ['datacraft/process_test_runs.rb']
    tasks.each do |task|
      script = IO.read(task)
      puts "#{Time.now} -> #{task}"
      instruction = Datacraft.parse(script)
      Datacraft.run instruction
    end
  end

  desc 'testing'
  task test: :environment do
    puts "#{ENV['USERNAME_'].class}"
    if ENV['USERN']
      puts 'yes'
    else
      puts 'no'
    end
    puts "#{ENV['USERNAME_']}"
  end
end
