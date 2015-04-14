require 'action_view'
class TestCase < ActiveRecord::Base
  include ActionView::Helpers::DateHelper
  belongs_to :test_suite
  has_many :steps
  has_many :attachments
  has_many :tags
  has_one :failure

  def inspect
    %(
    name: #{name}
    duration: #{distance_of_time_in_words self.end, start}
    )
  end

  def self.sync(test_suite, doc)
    tcs = doc.xpath('test-cases/test-case')
    logger.info "Found #{tcs.count} new test cases."
    tcs.each do |tc|
      name = tc.xpath('name').first.content
      start_time = Time.zone.at(tc['start'].to_i / 1000)
      test_case = TestCase.find_or_create_by(test_suite: test_suite, name: name, start: start_time)
      test_case.start = start_time
      test_case.end = Time.zone.at(tc['stop'].to_i / 1000)
      test_case.status = tc['status']
      #test_case.test_suite = test_suite
      test_case.save

      # sync steps
      tc.xpath('steps/step').each do |s|
        step_name = s.xpath('name').first.content
        step = Step.find_or_create_by(test_case: test_case, name: step_name)
        step.start = Time.zone.at(s['start'].to_i / 1000)
        step.end = Time.zone.at(s['stop'].to_i / 1000)
        step.status = s['status']
        step.save
      end

      # sync attachments
      tc.xpath('attachments/attachment').each_with_index do |a, i|
        attachment = Attachment.find_or_create_by(test_case: test_case, source: a['source'])
        attachment.title = a['title']
        attachment.kind = a['type']
        attachment.position = i
        attachment.save
      end

      # sync failure
      f = tc.xpath('failure').first
      if f
        failure = Failure.find_or_create_by(test_case: test_case)
        failure.message = f.xpath('message').first.content if f.xpath('message').first
        failure.stack_trace = f.xpath('stack-trace').first.content if f.xpath('stack-trace').first
        failure.save
      end

      # sync tags
      tc.xpath('parameters/parameter').each do |t|
        tag = Tag.find_or_create_by(test_case: test_case, name: t['name'])
        tag.value = t['value']
        tag.kind = t['kind']
        tag.save
      end
    end
  end

  def history(count = 10)
    TestCase.where(name: name)
      .where.not(id: id).order('start DESC').limit(count)
  end

  def consolidated_status(amount = 5)
    return status if status != 'broken'
    history(amount).each do |h|
      return h.status if %w(passed failed).include? h.status
    end
    status
  end
end
