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

  def count(status = nil, platform = nil)
    query = test_cases
    if not status.blank?
      query = query.where(status: status)
    end

    if not platform.blank?
      query = query.select do |tc|
        tc.tags.any? { |t| t.name == 'Platform' && t.value == platform }
      end
    end

    query.count
  end
end
