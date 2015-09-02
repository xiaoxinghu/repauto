require 'pathname'
require 'nori'
require 'pp'

def process(file)
  xml = File.read(file)
  # xml = '<tag>hello owrld</tag>'
  parser = Nori.new
  parser.parse(xml)
end

Pathname.glob('/Users/xiaoxing/Projects/te/lib/allure/allure_results/*.xml').each do |f|
  h = process(f)
  pp h
end
