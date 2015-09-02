require 'faker'

module Data::Allure
  module DataProvider
    def errors
      @errors ||= ['Page not found.',
                   'Button does not work.',
                   'Cannot find element.',
                   'Wrong hero.']
    end

    def error_msg
      errors.sample
    end

    def tag_set
      ['iPhone 6+', 'iOS', 'superhero']
    end

    def screenshot(step)
      img = 'batman' if step.start_with? 'Given'
      img = 'superman' if step.start_with? 'When'
      img = 'wonder_woman' if step.start_with? 'Then'
      File.new("#{img}.jpg")
    end
  end

  class TestSuite
    attr_accessor :start, :stop, :name, :test_cases

    def initialize
      @test_cases = []
    end

    def build(builder)
      builder.start_suite name, start
      test_cases.each do |test_case|
        test_case.build builder
      end
      builder.stop_suite name, stop
    end

    def to_s
      s = "#{name}: (#{start} -> #{stop})\n"
      test_cases.each do |test_case|
        s += "- #{test_case.to_s}\n"
      end
      s
    end

    def self.gen(start, size: 10, pass_rate: 0.6)
      test_suite = TestSuite.new
      test_suite.name = Faker::Hacker.noun
      test_suite.start = start
      timestamp = start
      size.times.each do
        passed = Faker::Number.between(1, 100) < (100 * pass_rate)
        status = passed ? :passed : [:failed, :broken].sample
        test_case, timestamp = TestCase.gen(timestamp, status)
        test_case.test_suite = test_suite
        test_suite.test_cases << test_case
      end
      test_suite.stop = timestamp
      test_suite
    end
  end

  class TestCase
    attr_accessor :start, :stop, :name, :status, :steps, :test_suite
    include Data::Allure::DataProvider

    def initialize
      @steps = []
    end

    def build(builder)
      builder.start_test test_suite.name, name, start, tags: tag_set.join(',')
      steps.each do |step|
        step.build builder
      end
      e = status == :passed ? nil : Exception.new(error_msg)
      builder.stop_test test_suite.name, name, status: status, exception: e, finished_at: stop
    end

    def to_s
      s = "#{name}: (#{start} - #{stop}), #{status}\n"
      steps.each do |step|
        s += "--> #{step.to_s}\n"
      end
      s
    end

    def self.gen(start, status)
      test_case = TestCase.new
      test_case.name = Faker::Lorem.sentence(3, true, 4)
      test_case.start = start
      test_case.status = status
      timestamp = start
      steps, timestamp = Step.all(timestamp, status)
      steps.each do |step|
        step.test_case = test_case
      end
      test_case.steps = steps
      test_case.stop = timestamp
      [test_case, timestamp]
    end
  end

  class Step
    attr_accessor :start, :stop, :name, :status, :test_case
    include DataProvider

    def build(builder)
      builder.start_step test_case.test_suite.name, test_case.name, name, start
      builder.add_attachment test_case.test_suite.name, test_case.name, file: screenshot(name)
      builder.stop_step test_case.test_suite.name, test_case.name, name, stop, status
    end

    def to_s
      "#{name} (#{start} - #{stop}), #{status}"
    end

    def self.gen(name, start, status)
      s = Step.new
      s.start = start
      s.stop = start + 60
      s.name = name
      s.status = status
      [s, s.stop]
    end

    def self.all(start, status)
      steps = []
      step_names = ["Given #{Faker::Hacker.noun} is #{Faker::Hacker.adjective}",
                    "When #{Faker::Name.name} #{Faker::Hacker.verb} the #{Faker::Hacker.noun}",
                    "Then the #{Faker::Hacker.noun} should be #{Faker::Hacker.adjective}"]
      timestamp = start
      status_array = gen_status(step_names.size, status)
      status_array.each_with_index do |s, i|
        step, timestamp = gen(step_names[i], timestamp, s)
        steps << step
      end
      # step_names.each do |s|
      #   step, timestamp = gen(s, timestamp, :passed)
      #   steps << step
      # end

      [steps, timestamp]
    end

    def self.gen_status(size, status)
      if status == :passed
        return size.times.collect { :passed }
      else
        issue_index = Faker::Number.between(0, size - 1)
        status_array = []
        size.times do |i|
          status_array << :passed if i < issue_index
          status_array << status if i == issue_index
          status_array << :cancelled if i > issue_index
        end
        return status_array
      end
    end
  end

end
