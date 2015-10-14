require './datacraft/model_plugins/project_plugin'

module TestCasePlugin
  def self.included(base)
    base.send :include, InstanceMethods
    base.extend ClassMethods
  end

  module InstanceMethods
  end

  module ClassMethods
    def parse(attachment)
      return nil unless attachment.type == 'test_suite'
      hash = to_hash attachment
      return nil unless valid?(hash)

      # get test cases
      project = attachment.test_run.project
      test_run = attachment.test_run
      each_test_case(hash['test_suite']) do |tc_hash|
        test_case = translate tc_hash
        test_case.test_suite_file_id = attachment.id
        test_case.def_id = project.get_test_case_def(tc_hash).id
        test_run.test_cases.push test_case
      end
      update_time(test_run,
                  hash['test_suite']['@start'],
                  hash['test_suite']['@stop'])
      test_run.save!
    end

    private

    def to_hash(attachment)
      hash = Nori.new.parse attachment.data.data
      hash
    end

    def valid?(hash)
      hash.key? 'test_suite'
    end

    def each_test_case(test_suite)
      return unless test_suite.key? 'test_cases'
      test_cases = test_suite['test_cases']['test_case']
      test_cases = test_cases.is_a?(Hash) ? [test_cases] : test_cases
      test_cases.each do |test_case|
        test_case['test_suite'] = test_suite['name']
        yield test_case
      end
    end

    def translate(hash)
      test_case = TestCase.new(
        status: hash['@status'],
        start: Time.at(hash['@start'].to_i / 1000.0),
        stop: Time.at(hash['@stop'].to_i / 1000.0),
        tags: get_tags(hash)
      )
      f = get_failure hash
      test_case.failure = f if f

      each_att(hash) do |a|
        test_case.attachments.push a
      end

      each_step(hash) do |step|
        test_case.steps.push step
      end
      test_case
    end

    def get_tags(hash)
      params = hash['parameters']
      labels = hash['labels']
      tags = []
      # old version
      if params
        params = hash['parameters']['parameter']
        params = [params] if params.is_a? Hash
        params.each do |param|
          tags << param['@value']
        end
      elsif labels # new version
        labels = hash['labels']['label']
        labels = [labels] if labels.is_a? Hash
        labels.each do |label|
          if label['@name'] == 'tags'
            tags = label['@value'].split(',')
          end
        end
      end
      tags
    end

    def get_failure(hash)
      return nil unless hash['failure']
      Failure.new(
        message: hash['failure']['message'],
        stack_trace: hash['failure']['stack_trace'])
    end

    def each_att(hash)
      return unless hash['attachments']
      atts = hash['attachments']['attachment']
      atts = [atts] if atts.is_a? Hash
      atts.compact.map do |att|
        a = Attachment.where(file_name: att['@source']).first
        next unless a
        a[:title] = att['@title']
        a[:mime] = att['@type']
        a.save!
        yield a
      end
    end

    def each_step(hash)
      return unless hash['steps']
      steps = hash['steps']['step']
      steps = [steps] if steps.is_a?(Hash)
      steps.each do |step|
        yield Step.new(
          start: Time.at(step['@start'].to_i / 1000.0),
          stop: Time.at(step['@stop'].to_i / 1000.0),
          status: step['@status']
        )
      end
    end

    def update_time(test_run, start, stop)
      start = Time.at(start.to_i / 1000.0)
      stop = Time.at(stop.to_i / 1000.0)
      test_run.start = start if !test_run.start || test_run.start > start
      test_run.stop = stop if !test_run.stop || test_run.stop < stop
    end
  end
end

TestCase.send(:include, TestCasePlugin)
