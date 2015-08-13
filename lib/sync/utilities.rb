require 'addressable/uri'
require 'httparty'
require 'mongo'
require 'nokogiri'

class MongoClient
  # @client = Mongo::Client.new([host], database: db)

  def self.client
    @@client ||= Mongo::Client.new(
      [MONGO_CONFIG['sessions']['default']['hosts'].first],
      database: MONGO_CONFIG['sessions']['default']['database'],
      max_pool_size: 100)
    @@client
  end
  def initialize
    Mongo::Logger.logger.level = Logger::WARN
  end
end

module FileCrawler
  def root
    "#{Rails.root}/public/#{APP_CONFIG['mount_point']}"
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

  def symbolize_keys
    transform_keys { |key| key.to_sym rescue key }
  end

  def symbolize_keys!
    transform_keys! { |key| key.to_sym rescue key }
  end
end
