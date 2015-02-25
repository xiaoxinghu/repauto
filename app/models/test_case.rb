class TestCase < ActiveRecord::Base
  belongs_to :test_suite

  def self.sync(test_suite, doc)
    tcs = doc.xpath("test-cases/test-case")
    puts "#{tcs.count} test cases."
    tcs.each do |tc|
      name = tc.xpath('name').first.content
      test_case = TestCase.find_or_create_by(test_suite: test_suite, name: name)
      test_case.start = Time.zone.at(tc['start'].to_i / 1000)
      test_case.end = Time.zone.at(tc['stop'].to_i / 1000)
      test_case.status = tc['status']
      test_case.test_suite = test_suite
      test_case.save
    end
  end
end
