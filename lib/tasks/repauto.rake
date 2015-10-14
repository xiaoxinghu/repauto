namespace :repauto do
  desc 'deploy'
  task deploy: :environment do
    puts 'install gems'
    `bundle install`
    puts 'install node components'
    `npm install`
    puts 'build assets'
    `gulp build`
    # if Rails.env == 'production'
    #   `nginx -s stop`
    #   `nginx`
    # end
  end

  desc 'test'
  task test: :environment do
    puts MONGO_CONFIG['sessions']['default']['hosts']
  end
end
