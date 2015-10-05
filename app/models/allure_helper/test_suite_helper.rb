module AllureHelper
  module TestSuiteHelper
    def parse(attachment)
      return nil unless attachment.tags.include? 'testsuite'
      hash = to_hash attachment
      return nil unless valid?(hash)
      test_suite = instantiation hash['test_suite']
      test_suite.file_name = attachment.file_name

      # get test cases
      project = attachment.test_run.project
      TestResult.parse(project, hash['test_suite']) do |test_result|
        test_suite.test_results.push test_result
        # test_result.save!
      end
      test_suite.save!
      test_run = attachment.test_run
      test_run.test_suites.push test_suite
      # test_suite.save!
      test_run.save!
      test_suite
    end

    private

    def to_hash(attachment)
      hash = Nori.new.parse attachment.data.data
      hash
    end

    def valid?(hash)
      hash.key? 'test_suite'
    end

    def instantiation(hash)
      TestSuite.new(
        name: hash['name'],
        start: Time.at(hash['@start'].to_i / 1000.0),
        stop: Time.at(hash['@stop'].to_i / 1000.0)
      )
    end
  end
end
