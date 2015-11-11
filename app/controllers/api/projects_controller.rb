module Api
  class ProjectsController < Api::BaseController
    before_action :set_resource, only: [:show, :trend, :summary]

    api! 'Get the trend of project.'
    def trend
      query = @project
        .test_runs
        .active
        .where(:start.ne => nil)

      if params[:name]
        query = query.where(name: params[:name])
      end

      query = query.sort(start: -1).limit(100)
      @trend = query.map do |test_run|
        data = {}
        data[:time] = test_run.start
        data[:ori] = Report.of(test_run).original_status
        data[:proc] = Report.of(test_run).processed_status
        data
      end
      respond_with @trend
    end

    api! 'Get summary of project.'
    def summary
      query = @project
        .test_runs
        .active
        .where(:start.ne => nil)
        .sort(start: -1)
        .limit(30)

      stats = {ori: {}, proc: {}, total_runs: 0}
      stats = query.reduce(stats) do |memo, test_run|
        report = Report.of(test_run)
        memo[:ori].merge!(report.original_status){ |_k, a, b| a + b }
        memo[:proc].merge!(report.processed_status){ |_k, a, b| a + b }
        memo[:total_runs] += 1
        memo
      end
      respond_with stats
    end

    # def query_params
    #   params.permit(:path)
    # end
  end
end
