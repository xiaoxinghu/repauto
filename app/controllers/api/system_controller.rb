module Api
  class SystemController < BaseController
    def info
      @info = {
        version: Repauto::VERSION,
        env: Rails.env
      }
    end
  end
end
