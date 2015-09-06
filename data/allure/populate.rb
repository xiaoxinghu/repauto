require 'allure-ruby-adaptor-api'
require 'pathname'
require 'tempfile'
require './generator'

class TypeOne
  include Data::Allure::Generator
end

def test
  puts Data::Allure::Step.gen_status(5, :broken)
end

def populate
  n_run = 10
  start_time = Time.now - (60 * 60 * 24 * 7)
  start_points = (0..5).map do |i|
    start_time + (60 * 60 * 24 * i)
  end

  start_points.each do |sp|
    g = TypeOne.new
    g.start_time = sp
    g.gen
  end

  # root = '/Users/xiaoxing/Projects/te/public/raw'
  # project = 'manhattan'
  # types = ['devices', 'regression']
  # types.each do |type|
  #   AllureRubyAdaptorApi.configure do |c|
  #     time = Time.now
  #     folder = time.strftime '%Y-%m-%d-%H-%M-%S'
  #     c.output_dir = "#{root}/#{project}/#{type}/#{folder}/allure/"
  #   end
  #   g_test_suite
  # end
end

populate
# g_test_case
# test
