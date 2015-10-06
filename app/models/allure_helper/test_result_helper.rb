module AllureHelper
  module TestResultHelper
    def parse(project, hash)
      result = get_test_cases(hash).map do |tc|
        test_case = TestCase.parse(project, tc)
        test_result = create_test_result(tc)
        get_step_results(test_case.steps, tc) do |step_result|
          test_result.step_results.push step_result
        end
        test_result.test_case_id = test_case.id
        yield test_result
      end
    end

    private

    def get_test_cases(hash)
      return [] unless hash.key? 'test_cases'
      test_cases = hash['test_cases']['test_case']
      test_cases.is_a?(Hash) ? [test_cases] : test_cases
    end

    def create_test_result(hash)
      test_result = TestResult.new(
        status: hash['@status'],
        start: Time.at(hash['@start'].to_i / 1000.0),
        stop: Time.at(hash['@stop'].to_i / 1000.0),
        tags: get_tags(hash)
      )
      f = get_failure hash
      test_result.failure = f if f

      get_att(hash) do |a|
        test_result.attachments.push a
      end
      test_result
    end

    def get_failure(hash)
      return nil unless hash['failure']
      Failure.new(
        message: hash['failure']['message'],
        stack_trace: hash['failure']['stack_trace'])
    end

    def get_att(hash)
      return unless hash['attachments']
      atts = hash['attachments']['attachment']
      atts = [atts] if atts.is_a? Hash
      atts.map do |att|
        a = Attachment.where(file_name: att['@source']).first
        next unless a
        a[:title] = att['@title']
        a[:type] = att['@type']
        a.save!
        yield a
      end
    end

    def get_step_results(step_defs, hash)
      step_defs.each_with_index do |step, index|
        matches = hash['steps']['step'].select { |s| s['name'] == step }
        next unless matches.size > 0
        match = matches.first
        yield StepResult.new(
          index: index,
          start: Time.at(match['@start'].to_i / 1000.0),
          stop: Time.at(match['@stop'].to_i / 1000.0),
          status: match['@status']
        )
      end
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
  end
end
