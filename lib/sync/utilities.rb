require 'addressable/uri'
require 'httparty'
require 'mongo'
require 'nokogiri'
require 'pathname'
require 'yaml'
require 'datacraft/tools'

# require './config/environment'
require './lib/sync/db'

if defined? Rails
  REPORT_ROOT = Pathname.new("#{Rails.root}/public/#{APP_CONFIG['mount_point']}")
  require "#{Rails.root}/lib/sync/io"
  MONGO_HOST = MONGO_CONFIG['clients']['default']['hosts']
  MONGO_DB = MONGO_CONFIG['clients']['default']['database']
  Mongo::Logger.logger.level = Logger::WARN
else
  REPORT_ROOT = Pathname.new('/Users/xhu/Projects/te/public/raw')
  require './io'
  MONGO_HOST = ['localhost:27017']
  MONGO_DB = 'testing'
  Mongo::Logger.logger.level = Logger::WARN
end

MONGO_CLIENT = Mongo::Client.new(
  MONGO_HOST,
  database: MONGO_DB,
  max_pool_size: 100)


class String
  def try_to_i
    Integer(self) rescue self
  end
end

class Hash
  def transform_keys
    return enum_for(:transform_keys) unless block_given?
    result = self.class.new
    each_key do |key|
      result[yield(key)] = self[key]
    end
    result
  end

  def transform_keys!
    return enum_for(:transform_keys!) unless block_given?
    keys.each do |key|
      self[yield(key)] = delete(key)
    end
    self
  end

  def transform_values!
    each do |key, value|
      self[key] = yield(value)
    end
  end

  def symbolize_keys
    transform_keys { |key| key.to_sym rescue key }
  end

  def symbolize_keys!
    transform_keys! { |key| key.to_sym rescue key }
  end

  def format_for_report
    transform_keys { |key| key.sub(/^@/, '') }
  end

  def format_for_report!
    transform_keys! { |key| key.is_a?(String) ? key.sub(/^@/, '') : key }
    symbolize_keys!
    transform_values! { |value| value.is_a?(String) ? value.try_to_i : value }
  end
end
