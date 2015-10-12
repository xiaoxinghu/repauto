namespace :repauto do
  desc 'deploy'
  task deploy: :environment do
    puts 'install gems'
    `bundle install`
    puts 'build assets'
    `gulp build`
    if Rails.env == 'production'
      `sudo nginx -s stop`
      `sudo nginx`
    end
  end

  desc 'test'
  task test: :environment do
    puts MONGO_CONFIG['sessions']['default']['hosts']
  end
end
