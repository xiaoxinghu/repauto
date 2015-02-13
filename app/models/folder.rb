class Folder
  include ActiveModel::Model

  attr_accessor :id, :path, :name

  def initialize(path)
    @path = path.gsub( /[^\/]+$/, '' )
    @id = @path.gsub(/\//, '_')
    @name = @path.split('/').last
    #@name = path
  end

  def self.html(path)
    Nokogiri::HTML(http_get(path))
  end

  def self.http_get(path)
    url = URI::join(APP_CONFIG['report_host'], path).to_s
    puts "Scanning... <#{url}>"
    HTTParty.get(url)
  end

  def self.ls(path)
    stop = true
    hrefs = []
    html_doc = html(path)
    html_doc.css('a').each do |link|
      if link.text.include? 'Parent'
        stop = false
        next
      end
      hrefs << link['href']
    end
    hrefs = [] if stop
    hrefs
  end

  def self.ls_dir(path)
    ls(path).select {|p| p.end_with? '/' }
  end

  def self.find(id)
    all.find { |f| f.id == id }
  end

  
  def self.find_files(file_name, path, files)
    ls(path).each do |p|
      if p.end_with? file_name
        files << p
      end
    end
    ls_dir(path).each do |p|
      find_files(file_name, p, files)
    end
  end

end
