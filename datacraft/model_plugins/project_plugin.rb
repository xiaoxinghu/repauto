module ProjectPlugin
  def self.included(base)
    base.send :include, InstanceMethods
    base.extend ClassMethods
  end

  module InstanceMethods
    def scan_for_test_runs
      pattern = File.join(DataSync.configuration.root,
                          self[:sn],
                          DataSync.configuration.test_run_pattern)
      Pathname.glob(pattern).select(&:directory?)
    end

    def get_test_case_def(hash)
      name = hash['name']
      test_suite = hash['test_suite']
      steps = []
      if hash.key? 'steps' && hash['steps'] != nil
        ss = hash['steps']['step']
        ss = [ss] if ss.is_a? Hash
        steps = ss.map do |s|
          s['name']
        end
      end
      TestCaseDef.find_or_create(self, name, test_suite, steps)
    end
  end

  module ClassMethods
    def scan_for_projects
      Pathname.glob("#{DataSync.configuration.project_pattern}/project.yml")
    end

    def sync(file)
      data = YAML.load_file(file)
      data[:sn] = file.relative_path_from(DataSync.configuration.root).dirname.to_s
      project = Project.where(sn: data[:sn]).first_or_create
      project.update(data)
      project.save!
      project.touch
      project
    end
  end
end

Project.send(:include, ProjectPlugin)
