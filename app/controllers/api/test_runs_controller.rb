module Api
  class TestRunsController < Api::BaseController
    before_action :set_resource, only: [:show, :update, :archive, :restore]
    include ParamTool

    def index
      project = Project.find(params[:project_id])
      query = project.test_runs
        .where(query_params)
        .page(page_params[:page])
        .per(page_params[:page_size])
        .order_by(start: 'desc')
      @test_runs = query
    end

    def archive
      @test_run.update_attributes(archived_at: Time.zone.now)
      @test_run.save!
    end

    def restore
      @test_run.remove_attribute(:archived_at)
      @test_run.save!
    end

    def diff
      tr1 = TestRun.find(params[:id1])
      tr2 = TestRun.find(params[:id2])
      @prev, @current = [tr1, tr2].sort_by(&:start).map(&:test_cases)
    end

    def create
      begin
        validate_params([:project_id, :name, :status], params)
        project = Project.find(params[:project_id])
        @test_run = project.test_runs.build(name: params[:name], start: Time.now, status: params[:status])
        @test_run.save!
      rescue StandardError => error
        @error = error
      end
    end

    def update

    end

    def order_params
      { sn: 'desc' }
    end

    def query_params
      custom_params = params.permit(:project, :name, :archived)
      archived = custom_params.delete(:archived)
      custom_params[:archived_at.exists] = archived
      custom_params[:start.exists] = true
      custom_params
    end
  end
end
