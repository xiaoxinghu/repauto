class TestRun < ActiveRecord::Base
  include Crawler
  belongs_to :project
  has_many :test_suites

  def self.sync(project:, deep: false)
    ls_dir(project.path, []).each do |d|
      name = d.split('/').last
      ls_dir(d, []).each do |folder|
        time = get_time folder
        folder.slice! project.path
        # next if TestRun.where(project: project, path: folder).any?
        next unless time
        next if !deep && (Time.now - time > 1.days)
        tr = TestRun.find_or_create_by(project: project, path: folder)
        tr.name = name
        tr.save

        TestSuite.sync tr
      end
    end
  end

  def full_path
    self.project.path + self.path
  end

  def report_path
    File.join(self.full_path, 'report')
  end

  def count(status = nil)
    sum = 0
    test_suites.each do |ts|
      sum += ts.get_test_cases(status).count
    end
    sum
  end

  def status_count(platform = nil, consolidate = 0)
    count = {}
    test_suites.each do |ts|
      count.merge!(ts.status_count(platform, consolidate)) { |_k, o, n| o + n }
    end
    count
  end
end
