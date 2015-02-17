require 'addressable/uri'

class Folder
  include ActiveModel::Model

  attr_accessor :id, :path, :name

  def initialize(path)
    @path = path.gsub( /[^\/]+$/, '' )
    @id = @path.gsub(/\//, '_')
    @name = @path.split('/').last
    #@name = path
  end

  def get_date
    dates = @path.split('/').select do |p|
      begin
        Date.parse(p)
        true
      rescue ArgumentError
        false
      end
    end
    Date.parse(dates.last)
  end

  def self.html(path)
    Nokogiri::HTML(http_get(path))
  end

  def self.http_get(path)
    begin
      p = Addressable::URI.parse(URI.encode(path))
      #url = URI.encode URI::join(APP_CONFIG['report_host'], encoded_uri).to_s
      url = Addressable::URI::join(APP_CONFIG['report_host'], p).to_s
      HTTParty.get(url)
    rescue URI::InvalidURIError
      puts "got invalid uri #{url}"
      nil
    end
  end

  def self.ls(path, skip)
    stop = true
    hrefs = []
    html_doc = html(path)
    html_doc.css('a').each do |link|
      if link.text.include? 'Parent'
        stop = false
        next
      end
      hrefs << link['href'] if not skip.any? {|s| link['href'].split('/').last == s}
    end
    hrefs = [] if stop
    hrefs
  end

  def self.ls_dir(path, skip)
    ls(path, skip).select {|p| p.end_with? '/' }
  end

  def self.find(id)
    all.find { |f| f.id == id }
  end

  
  def self.find_files(file_name, path, files, skip = [])
    puts "Scanning for file #{file_name}... <#{path}>"
    ls(path, skip).each do |p|
      if p.end_with? file_name
        files << p
        return
      end
    end
    ls_dir(path, skip).each do |p|
      find_files(file_name, p, files)
    end
  end

  def self.find_title(title, path, results, skip = [])
    puts "Scanning for title #{title}... <#{path}>"
    html_doc = html(path)
    return if html_doc.css('title').size == 0
    if html_doc.css('title')[0].text.include? title
      results << path
    else
      ls_dir(path, skip).each do |p|
        find_title(title, p, results, skip)
      end
    end
  end

end
