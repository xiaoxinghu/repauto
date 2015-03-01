class TestRun < ActiveRecord::Base
  include Crawler
  belongs_to :project
  has_many :test_suites

  def self.sync(project)
    ls_dir(project.path, []).each do |d|
      name = d.split('/').last
      ls_dir(d, []).each do |folder|
        dt = get_datetime folder
        next if TestRun.where(path: folder).any?
        if dt
          tr = TestRun.find_or_create_by(path: folder)
          tr.name = name
          tr.project = project
          tr.start = dt
          tr.end = dt
          tr.save

          puts "- Test Run: #{tr.name}"

          TestSuite.sync tr

        end
      end
    end
  end

  def count(status = nil)
    sum = 0
    test_suites.each do |ts|
      sum += ts.count(status)
    end
    puts "sum: #{sum}"
    sum
  end

end
