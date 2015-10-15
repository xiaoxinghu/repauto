require './datacraft/model_plugins/attachment_plugin'

module TestRunPlugin
  def self.included(base)
    base.send :include, InstanceMethods
    base.extend ClassMethods
  end
  module InstanceMethods
  end
  module ClassMethods
    def check(path)
      _project_sn, _name, time = path.to_s.split('/').last(3)
      return [false, 'allure folder does not exist'] unless Pathname.new("#{path}/allure").exist?
      begin
        Time.strptime(time, '%Y-%m-%d-%H-%M-%S')
      rescue StandardError => e
        return [false, e.message]
      end
      [true, nil]
    end

    def import(path)
      cleanup = false
      project, name, sn = interpret_path(path)
      mutex = Mutex.new
      test_run = mutex.synchronize do
        TestRun
        .where(project: project, name: name, sn: sn)
        .first_or_create
      end
      status_file = path.join(DataSync.configuration.status_file_name)
      keep_file = path.join(DataSync.configuration.keep_file_name)
      if status_file.exist?
        status = YAML.load_file(status_file)
        if status.is_a? Hash
          cleanup = (status['status'] && (status['status'] == 'done'))
          test_run.status = status['status']
          test_run.save!
        end
      else
        cleanup = (path.mtime < 10.minutes.ago) unless keep_file.exist?
      end
      # import attachments
      pattern = File.join(path,
                          DataSync.configuration.allure_file_pattern)
      Attachment.scan_for_attachments(pattern).each do |file|
        att = Attachment.parse(file)
        test_run.attachments.build(att)
        test_run.save! # this might be a performance drag, but for data dignity sake when crash happens
        FileUtils.remove_file(file) if DataSync.configuration.auto_cleanup
      end
      FileUtils.rm_r(path) if DataSync.configuration.auto_cleanup && cleanup
    end

    private

    def interpret_path(path)
      project_sn, name, sn = path.each_filename.to_a.last(3)
      project = Project.find_by(sn: project_sn)
      [project, name, sn]
    end

  end
  # def scan_for_test_runs(project)
  #   Pathname.glob(DataSync.configuration.test_run_pattern).select(&:directory?)
  # end
end

TestRun.send(:include, TestRunPlugin)
