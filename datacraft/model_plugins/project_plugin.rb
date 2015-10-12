module ProjectPlugin
  def self.included(base)
    base.send :include, InstanceMethods
    base.extend ClassMethods
  end

  module InstanceMethods
    def scan_for_test_runs
      pattern = File.join(DataSync.configuration.root,
                          sn,
                          DataSync.configuration.test_run_pattern)
      Pathname.glob(pattern).select(&:directory?)
    end

    def get_test_case_def(hash)
      name = hash['name']
      test_suite = hash['test_suite']
      steps = []
      if hash.key? 'steps'
        ss = hash['steps']['step']
        ss = [ss] if ss.is_a? Hash
        steps = ss.map do |s|
          s['name']
        end
      end
      md5 = get_md5(name, test_suite, steps)
      tcd = TestCaseDef.where(md5: md5).first
      return tcd if tcd
      tcd = TestCaseDef.new(
        name: name,
        test_suite: test_suite,
        steps: steps,
        md5: md5
      )
      test_case_defs.push tcd
      tcd.save!
      tcd
    end

    private

    def get_md5(*args)
      md5 = Digest::MD5.new
      args.each do |arg|
        if arg.is_a? Array
          arg.each { |a| md5 << a }
        else
          md5 << arg
        end
      end
      md5.hexdigest
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
      project
    end
  end
end

Project.send(:include, ProjectPlugin)
