require 'faker'
require './data_types'

module Data::Allure
  module Generator
    attr_accessor :root, :project, :type
    attr_accessor :n_run, :n_suite, :n_case
    attr_accessor :deviation_rate, :pass_rate
    attr_accessor :start_time, :timestamp

    def initialize
      @root = '/Users/xiaoxing/Projects/te/public/raw'
      @project = 'manhattan'
      @type = 'regression'
      @n_suite = 8
      @n_case = 20
      @deviation_rate = 0.2
      @pass_rate = 0.6
      # default to be a week ago
    end

    def g_run
      @timestamp = start_time.clone
      AllureRubyAdaptorApi.configure do |c|
        folder = start_time.strftime '%Y-%m-%d-%H-%M-%S'
        c.output_dir = "#{root}/#{project}/#{type}/#{folder}/allure/"
      end
      builder = AllureRubyAdaptorApi::Builder
      pass_rate = 0.5
      num_of_suite = deviate(n_suite)
      puts "Generating #{num_of_suite} test suites."
      total_num_of_case = 0
      num_of_suite.times.each do
        num_of_case = deviate(n_case)
        puts "Generating #{num_of_case} test cases."
        ts = Data::Allure::TestSuite.gen start_time, pass_rate: pass_rate, size: num_of_case
        ts.build builder
        pass_rate += 0.1
        total_num_of_case += num_of_case
      end
      builder.build!
      puts "#{num_of_suite * total_num_of_case} test cases generated."
    end

    def deviate(base)
      d = (base * deviation_rate).to_i
      Faker::Number.between(base - d, base + d)
    end

    def gen
      g_run
    end
  end
end
