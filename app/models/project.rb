class Project < ActiveRecord::Base
  include Crawler
  has_many :test_runs

  def self.sync
    puts "Sync projects ..."
    yml_files = []
    find_files 'project.yml', APP_CONFIG['report_root'], yml_files, ['log', 'allure']

    yml_files.each do |f|
      yaml = http_get(f).body
      meta = YAML::load(yaml)
      path = f.gsub( /[^\/]+$/, '' )
      p = Project.find_or_create_by path: path
      p.path = path
      p.name = path.split('/').last
      p.stream = meta['stream']
      p.save
      puts "- Project: #{p.name}"

      TestRun.sync p
    end
  end

end
