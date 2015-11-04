require 'uri'
require 'datacraft'

namespace :data do
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

  task cleanup: :environment do
    date = DataCleanup.configuration.max_life.days.ago
    Project.all.each do |project|
      project.run_types.each do |type|
        total = project.test_runs.where(name: type).size
        max_to_del = total - DataCleanup.configuration.keep_amount
        next unless max_to_del > 0
        to_del = project.test_runs
          .where(name: type)
          .where(:start.lte => date)
          .order_by(start: 'asc')
          .limit(max_to_del)
        to_del.each do |td|
          archive = TestRun.new(
            name: td.name,
            start: td.start,
            stop: td.stop,
            project: td.project,
            report: td.report
          )
          archive.with(collection: 'archived_test_runs').save!
          td.delete
        end
      end
    end
  end

  task dry_clean: :environment do
    date = DataCleanup.configuration.max_life.days.ago
    Project.all.each do |project|
      project.run_types.each do |type|
        total = project.test_runs.where(name: type).size
        max_to_del = total - DataCleanup.configuration.keep_amount
        puts "project: #{project.project}, run: #{type}, total: #{total}, max delete: #{max_to_del}"
        next unless max_to_del > 0
        to_del = project.test_runs
          .where(name: type)
          .where(:start.lte => date)
          .order_by(start: 'asc')
          .limit(max_to_del)
        puts "all to del: #{to_del.size}"
      end
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
