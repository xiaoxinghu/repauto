class Project < ActiveRecord::Base
  include Crawler
  has_many :test_runs
  has_many :dashboards

  def self.sync(name: nil, deep: false)
    yml_files = []
    find_files 'project.yml', APP_CONFIG['report_root'], yml_files, ['log', 'allure']

    yml_files.each do |f|
      yaml = http_get(f).body
      meta = YAML::load(yaml)
      if name
        next if meta['project'] != name
      end
      path = f.gsub(/[^\/]+$/, '')
      #p = Project.find_or_create_by name: meta['project'], stream: meta['stream']
      p = Project.find_or_create_by path: path
      p.name = meta['project']
      p.stream = meta['stream']
      p.save
      logger.info "- Sync Project: #{p.name}"


      #Dashboard.where.not(project: p, name: meta['dashboards'].map { |x| x['name'] }).delete
      meta['dashboards'].each do |d|
        dashboard = Dashboard.find_or_create_by name: d['name'], project: p
        dashboard.link = d['url']
        if d.key? 'desc'
          dashboard.desc = d['desc']
        else
          dashboard.desc = "Dashboard #{dashboard.name} for project #{p.name}."
        end
        dashboard.save
      end

      TestRun.sync project: p, deep: deep
    end
  end

end
