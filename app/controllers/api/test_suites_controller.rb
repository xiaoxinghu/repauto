module Api
  class TestSuitesController < Api::BaseController
    before_action :set_resource, only: [:show]
    # def index
    #   puts params
    #   if params[:project_id]
    #     project = Project.find(params[:project_id])
    #     @test_runs = project.test_runs
    #   else
    #     super
    #   end
    # end

    def query_params
      params.permit(:path)
    end
  end
end
