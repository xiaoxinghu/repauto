module Api
  class ProjectsController < Api::BaseController
    before_action :set_resource, only: [:show, :run_types]

    def run_types
      @types = TestRun.where(project_path: @project.path).distinct(:type)
      respond_with @types
    end

    # def query_params
    #   params.permit(:path)
    # end
  end
end
