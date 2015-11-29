module Api
  class ProjectsController < Api::BaseController
    before_action :set_resource, only: [:show, :trend, :matrix, :summary]

    api! 'Get all projects.'
    def index
      super
    end

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
        data[:ori] = test_run.report.original_status
        data[:proc] = test_run.report.processed_status
        data
      end
      respond_with @trend
    end

    api! 'Get the matrix of project.'
    def matrix
      @matrix = []
      @project.test_case_defs.each do |tcd|
        @matrix << { def: tcd, history: tcd.history.to_a }
      end
    end

    api! 'Get summary of project.'
    def summary
      query = @project
        .test_runs
        .active
        .where(:start.ne => nil)
        .sort(start: -1)
        .limit(30)

      stats = { ori: {}, proc: {}, total_runs: 0 }
      stats = query.reduce(stats) do |memo, test_run|
        report = test_run.report
        memo[:ori].merge!(report.original_status){ |_k, a, b| a + b }
        memo[:proc].merge!(report.processed_status){ |_k, a, b| a + b }
        memo[:total_runs] += 1
        memo
      end
      respond_with stats
    end

    api! 'Create a project.'
    param :name, String, desc: 'project name', required: true
    param :stream, String, desc: 'project stream', required: true
    def create
      if Project.any_of({ name: params[:name] }, { project: params[:name] }).exists?
        fail "Project name '#{params[:name]}' already exists."
      end
      @project = Project.create!(name: params[:name], stream: params[:stream])
    end

    # def query_params
    #   params.permit(:path)
    # end
  end
end
