module Markup
  class Markdown
    def initialize
      require 'redcarpet'
      renderer = Redcarpet::Render::HTML.new
      @markdown = Redcarpet::Markdown.new(renderer)
    end
    def to_html(text)
      @markdown.render(text)
    end
  end
end
