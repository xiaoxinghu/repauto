namespace :repauto do
  desc 'deploy'
  task deploy: :environment do
    # stop sidekiq (not using it anymore)
    #`sidekiqctl stop ./tmp/pids/sidekiq.pid`

    puts 'install gems'
    `bundle install`
    puts 'install bower packages'
    Rake::Task['bower:install'].invoke
    Rake::Task['assets:precompile'].invoke
    if Rails.env == 'production'
      `sudo nginx -s stop`
      `sudo nginx`
    end

    # start sidekiq
    # `sidekiq -d`
  end

  desc 'test'
  task test: :environment do
    puts MONGO_CONFIG['sessions']['default']['hosts']
  end
end
