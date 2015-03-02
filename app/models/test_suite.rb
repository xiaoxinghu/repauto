class TestSuite < ActiveRecord::Base
  include Crawler
  belongs_to :test_run
  has_many :test_cases

  def self.sync(test_run)
    found = 0
    ls_xml(File.join(test_run.path, 'allure')).each do |xml|
      found += 1
      content = Nokogiri::XML(http_get(xml).body)
      content.xpath("xmlns:test-suite").each do |ts|
        test_suite = TestSuite.find_or_create_by(path: xml)
        test_suite.name = ts.xpath('name').first.content
        test_suite.start = Time.zone.at(ts['start'].to_i / 1000)
        test_suite.end = Time.zone.at(ts['stop'].to_i / 1000)
        test_suite.test_run = test_run
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

  def count(status = nil)
    if status.blank?
      test_cases.count
    else
      test_cases.select { |tc| tc.status == status }.count
    end
  end
end
