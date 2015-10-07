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
  task sync: [:environment, :import, :process] do
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

  desc 'import raw data into database'
  task import: :environment do
    tasks = ['datacraft/sync_projects.rb', 'datacraft/import_test_runs.rb']
    tasks.each do |task|
      script = IO.read(task)
      puts task
      instruction = Datacraft.parse(script)
      Datacraft.run instruction
    end
  end

  desc 'process allure results'
  task process: :environment do
    tasks = ['datacraft/process_test_runs.rb']
    tasks.each do |task|
      script = IO.read(task)
      instruction = Datacraft.parse(script)
      Datacraft.run instruction
    end
  end

  desc 'testing'
  task test: :environment do
  end
end
