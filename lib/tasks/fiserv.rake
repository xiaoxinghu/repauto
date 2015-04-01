namespace :fiserv do
  desc "deploy"
  task deploy: :environment do
    # stop sidekiq
    `sidekiqctl stop ./tmp/pids/sidekiq.pid`
    puts 'install bower packages'
    Rake::Task['bower:install'].invoke
    Rake::Task['assets:precompile'].invoke
    if Rails.env == 'production'
      `sudo nginx -s stop`
      `sudo nginx`
    end

    # start sidekiq
    `sidekiq -d`
  end

  desc 'test'
  task test: :environment do
    `sidekiq -d`
  end
end
