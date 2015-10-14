module Api
  class ProjectsController < Api::BaseController
    before_action :set_resource, only: [:show, :run_types, :trend]

    def run_types
      @types = TestRun.where(project_path: @project.path).distinct(:type)
      respond_with @types
    end

    def trend
      history = @project
        .test_runs
        .active
        .where(:start.ne => nil)
        .where(name: params[:type])
        .sort(start: -1)
        .limit(30)
      @trend = history.map do |test_run|
        data = test_run.counts.clone
        data[:time] = test_run.start
        data
      end
      respond_with @trend
    end

    # def query_params
    #   params.permit(:path)
    # end
  end
end
