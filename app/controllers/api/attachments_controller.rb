module Api
  class AttachmentsController < Api::BaseController
    before_action :set_resource, only: [:raw]

    api! 'show raw content of the attachment'
    def raw
      send_data @attachment.data.data, type: @attachment[:type], disposition: 'inline'
    end

    api! 'upload an attachment'
    param :desc, String, desc: 'description of the attachment', required: true
    param :type, ['log', 'screenshot', 'pagesource'], desc: 'type of the attachment', required: true
    param :time, String, desc: 'timestamp', required: true
    param :file, File, desc: 'the attachment file', required: true
    param :test_case_id, String, desc: 'test case id', required: true
    def create
      file = params[:file]
      test_case = TestCase.find(params[:test_case_id])
      data = IO.binread(file.tempfile)
      @attachment = Attachment.new(
        desc: params[:desc],
        type: params[:type],
        size: data.size,
        time: Time.at(params[:time].to_i / 1000.0),
        mime: file.content_type,
        data: BSON::Binary.new(data, :generic)
      )
      @attachment.save!
      test_case.attachments.push @attachment
      test_case.save!
    end
  end
end
