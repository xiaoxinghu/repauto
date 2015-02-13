module FolderHelper

  def ls(path)
    hrefs = []
    url = URI::join(APP_CONFIG['report_host'], path).to_s
    html_doc = Nokogiri::HTML(HTTParty.get(url))
    html_doc.css('a').each do |link|
      if link.text.include? 'Parent'
        next
      end
      hrefs << Project.new(link['href'])
    end
    hrefs
  end

end
