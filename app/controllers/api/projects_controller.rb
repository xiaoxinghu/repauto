module Api
  class ProjectsController < Api::BaseController
    before_action :set_resource, only: [:show, :run_names, :trend]

    def run_names
      names = @project.test_runs.distinct(:name)
      # @types = TestRun.where(project_path: @project.path).distinct(:type)
      respond_with names
    end

    def trend
      history = @project
        .test_runs
        .active
        .where(:start.ne => nil)
        .where(name: params[:name])
        .sort(start: -1)
        .limit(30)
      @trend = history.map do |test_run|
        # data = test_run.counts.clone
        data = Report.of(test_run).original_status.clone
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
