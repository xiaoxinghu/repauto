namespace :report do
  desc 'Sync data to database'
  task sync: :environment do
    start = Time.now
    logger = Logger.new(STDOUT)
    logger.level = Rails.logger.level
    Rails.logger = logger
    logger.info 'Start Syncing...'
    Project.sync
    finish = Time.now
    logger.info "Sync Finished. Started at #{start}. Took #{finish - start} seconds."
  end

  desc 'Manually sync data to database'
  task msync: :environment do
    # turn off cron task
    `crontab -r`

    Rake::Task['report:sync'].invoke

    # turn cron task back on
    `whenever --update-crontab`
  end

  desc "testing"
  task test: :environment do
    # project = Project.new
    # project.name = 'FP5'
    # project.stream = 'Retail'
    # project.path = 'www.google.com'
    # project.desc = 'FP5 team'

    # #project.save

    # tr = TestRun.new
    # tr.name = 'flaky'
    # tr.start = 2.hours.ago
    # tr.end = 5.minutes.ago
    # tr.report = 'www.github.com'
    # tr.project = Project.first
    # #tr.save

    # Project.all.each do |p|
    #   puts "Project: #{p.name}"
    #   puts "- Path: #{p.path}"
    #   puts "- Stream: #{p.stream}"
    #   test_runs = TestRun.where(project: p)
    #   #test_runs = p.test_runs
    #   if test_runs
    #     test_runs.each do |tr|
    #       puts "+++ TestRun: #{tr.name}"
    #       puts "+++ path: #{tr.path}"
    #       puts "+++ Start: #{tr.start}"
    #       test_suites = TestSuite.where(test_run: tr)
    #       if test_suites
    #         test_suites.each do |ts|
    #           puts ">>>>> TestSuit: #{ts.name}"
    #           puts ">>>>> path: #{ts.path}"
    #           puts ">>>>> start: #{ts.start}"
    #           puts ">>>>> end: #{ts.end}"
    #           test_cases = TestCase.where(test_suite: ts)
    #           if test_cases
    #             test_cases.each do |tc|
    #               puts "******** TestCase: #{tc.name}"
    #             end
    #           end
    #         end
    #       end
    #     end
    #   end
    # end

    puts 'Hello World.'

  end

end
