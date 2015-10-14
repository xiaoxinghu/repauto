module AllureHelper
  module AttachmentHelper
    def from_file(file)
      file_name = get_name file
      size = file.size
      tags = []
      if file_name.end_with? '-testsuite.xml'
        tags << 'testsuite'
      elsif file_name.include? 'attachment'
        tags << 'attachment'
      end

      data = ''
      if file_name.end_with? '.jpg'
        tags << 'image'
        image = MiniMagick::Image.open(file)
        image.resize '600x600'
        data = image.to_blob
        size = image.size
        # data = optim.optimize_image_data(data)
        # puts "ori: #{file.size}, now: #{size}, data: #{data.size}"
      else
        data = IO.binread(file)
      end

      attachment = Attachment.where(file_name: file_name).first_or_create
      attachment.size = size
      attachment.data = BSON::Binary.new(data, :generic)
      attachment.tags = tags
      attachment
    end

    def imported?(file)
      Attachment.where(file_name: get_name(file)).exists?
    end

    private

    def get_name(file)
      file.basename.to_s
    end

    def optim
      @optim ||= ImageOptim.new(
        pngout: false,
        svgo: false,
        allow_lossy: true,
        jpegoptim: { max_quality: 50 })
      @optim
    end
  end
end
