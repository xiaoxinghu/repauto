namespace :fiserv do
  desc "deploy"
  task deploy: :environment do
    puts Rails.env
    puts 'install bower packages'
    Rake::Task['bower:install'].invoke
    Rake::Task['assets:precompile'].invoke
    if Rails.env == 'production'
      `sudo nginx -s stop`
      `sudo nginx`
    end
  end
end

