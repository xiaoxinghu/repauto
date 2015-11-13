module AttachmentPlugin
  def self.included(base)
    base.send :include, InstanceMethods
    base.extend ClassMethods
  end
  module InstanceMethods
  end
  module ClassMethods
    def scan_for_attachments(pattern)
      Pathname.glob(pattern).select(&:file?)
    end

    def parse(file)
      file_name = file.basename.to_s
      type, mime, data = process(file)
      attachment = {
        file_name: file_name,
        full_path: file.cleanpath.to_s,
        type: type,
        mime: mime,
        size: data.size,
        data: BSON::Binary.new(data, :generic)
      }
      # attachment = Attachment.where(file_name: file_name).first_or_create
      # attachment.type, data = process(file)
      # attachment.size = data.size
      # attachment.data = BSON::Binary.new(data, :generic)
      attachment
    end

    private

    def process(file)
      file_name = file.basename.to_s
      mime = Rack::Mime.mime_type(file.extname)
      data = IO.binread(file)
      type = :screenshot if file_name.include?('attachment') && mime.start_with?('image/')
      type = :test_suite if file_name.end_with?('-testsuite.xml')
      type = :log if file_name.include?('attachment') && ( mime == 'text/plain' )
      [type, mime, data]
    end

    def optimize_image(file)
      image = MiniMagick::Image.open(file)
      image.resize DataSync.configuration.image_size
      image.to_blob
    end

    def image?(file_name)
      file_name.include?('attachment') &&
        ['.jpg', '.jpeg', '.png'].include?(File.extname file_name)
    end

    def text_file?(file_name)
      file_name.include?('attachment') &&
        ['.log', '.txt'].include?(File.extname file_name)
    end
  end
end

Attachment.send(:include, AttachmentPlugin)
