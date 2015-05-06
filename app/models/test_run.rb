class TestRun < ActiveRecord::Base
  #default_scope { where('removed_at IS NULL') }
  default_scope { where removed_at: nil }
  include Crawler
  belongs_to :project
  has_many :test_suites
  has_many :test_cases, through: :test_suites

  def self.sync(project:, deep: false)
    ls_dir(project.path, []).each do |d|
      name = d.split('/').last
      ls_dir(d, []).each do |folder|
        time = get_time folder
        folder.slice! project.path
        # next if TestRun.where(project: project, path: folder).any?
        next unless time
        next if !deep && (Time.now - time > 2.days)
        tr = TestRun.find_or_create_by(project: project, path: folder)
        tr.name = name
        puts "#{File.join(project.path, folder)}"
        if ls_file(File.join(project.path, folder), 'in_progress').size > 0
          tr.in_progress = true
        else
          tr.in_progress = false
        end
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

  # def count(status = nil)
  #   query = test_cases
  #   query = query.where(status: status) unless status.blank?
  #   query.count
  # end

  # def status_count(platform = nil, consolidate = 0)
  #   count = {}
  #   # test_suites.each do |ts|
  #   #   count.merge!(ts.status_count(platform, consolidate)) { |_k, o, n| o + n }
  #   # end
  #   # count

  #   query = test_cases
  #   if platform
  #     query = query.includes(:tags).where(tags: { value: platform })
  #   end
  #   count = query.group(:status).count
  #   if consolidate > 1
  #     get_test_cases('broken', platform).each do |tc|
  #       count['broken'] -= 1
  #       count[tc.consolidated_status] = 0 unless count[tc.consolidated_status]
  #       count[tc.consolidated_status] += 1
  #     end
  #   end
  #   count
  # end

end
