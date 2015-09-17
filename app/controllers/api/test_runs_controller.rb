module Api
  class TestRunsController < Api::BaseController
    before_action :set_resource, only: [:progress, :test_cases]
    # def index
    #   puts params
    #   if params[:project_id]
    #     project = Project.find(params[:project_id])
    #     @test_runs = project.test_runs
    #   else
    #     super
    #   end
    # end

    def test_cases
      @test_cases = @test_run.test_cases
      @test_cases = []
      @test_run.test_suites.each do |ts|
        ts.test_cases.each do |tc|
          tc[:test_suite] = ts
          @test_cases << tc
        end
      end
    end

    def progress
      respond_with get_resource
    end

    def query_params
      params.permit(:project_path)
    end
  end
end
