require 'addressable/uri'

module Crawler
  extend ActiveSupport::Concern

  included do

  end

  module ClassMethods

    def html(path)
      Nokogiri::HTML(http_get(path))
    end

    def http_get(path)
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

    def ls(path, skip)
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

    def ls_xml(path)
      ls(path, []).select {|p| p.end_with? '.xml'}
    end

    def ls_dir(path, skip)
      puts "ls_dir -> #{path}"
      ls(path, skip).select {|p| p.end_with? '/' }
    end

    def find_files(file_name, path, files, skip = [])
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

    def find_title(title, path, results, skip = [])
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


    def get_datetime(path)
      path.split('/').reverse_each do |p|
        begin
          if p.size == 10
            return DateTime.strptime(p, '%Y-%m-%d')
          elsif p.size == 19
            return DateTime.strptime(p, '%Y-%m-%d-%H-%M-%S')
          else
            next
          end
        rescue ArgumentError
          next
        end
      end

      return nil
    end
  end
end
