class TestSuite < ActiveRecord::Base
  include Crawler
  belongs_to :test_run
  has_many :test_cases

  def self.sync(test_run)
    found = 0
    ls_xml(File.join(test_run.full_path, 'allure')).each do |xml|
      found += 1
      content = Nokogiri::XML(http_get(xml).body)
      xml.slice! test_run.full_path

      next if TestSuite.where(test_run: test_run, path: xml).any?
      content.xpath("xmlns:test-suite").each do |ts|
        test_suite = TestSuite.find_or_create_by(test_run: test_run, path: xml)
        test_suite.name = ts.xpath('name').first.content
        test_suite.start = Time.zone.at(ts['start'].to_i / 1000)
        test_suite.end = Time.zone.at(ts['stop'].to_i / 1000)
        test_suite.save

        if not test_run.end or test_suite.end > test_run.end
          test_run.end = test_suite.end
          test_run.save
        end
        if not test_run.start or test_suite.start < test_run.start
          test_run.start = test_suite.start
          test_run.save
        end
        puts "- Test Suite: #{test_suite.name}"
        TestCase.sync(test_suite, ts)
      end
    end
  end

  def full_path
    self.test_run.full_path + self.path
  end

  def get_test_cases(status = nil, platform = nil)
    query = test_cases
    if !platform.blank?
      query = query.includes(:tags).where(tags: { value: platform })
    end
    if !status.blank?
      query = query.where(status: status)
    end
    query
  end

  def status_count(platform = nil, consolidate = 0)
    query = test_cases
    if platform
      query = query.includes(:tags).where(tags: { value: platform })
    end
    count = query.group(:status).count
    if consolidate > 1
      get_test_cases('broken', platform).each do |tc|
        count['broken'] -= 1
        count[tc.consolidated_status] = 0 unless count[tc.consolidated_status]
        count[tc.consolidated_status] += 1
      end
    end
    count
  end

  def consolidated_count
    query = test_cases
    query = query.where(status: 'broken')
  end
end
