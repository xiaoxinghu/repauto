module Api
  class AttachmentsController < Api::BaseController
    before_action :set_resource, only: [:raw]
    def raw
      send_data @attachment.data.data, type: @attachment[:type], disposition: 'inline'
    end
  end
end
