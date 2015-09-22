module Api
  class TestCasesController < Api::BaseController
    before_action :set_resource, only: [:archive]

  end
end
