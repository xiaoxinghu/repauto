module Api
  class TestRunsController < Api::BaseController
    before_action :set_resource, only: [:show, :stop, :update, :archive, :restore]

    api! 'List all test runs under project.'
    def index
      project = Project.find(params[:project_id])
      query = project.test_runs
        .where(query_params)
        .page(page_params[:page])
        .per(page_params[:page_size])
        .order_by(start: 'desc')
      @test_runs = query
    end

    api! 'Archive test run.'
    def archive
      @test_run.update_attributes(archived_at: Time.zone.now)
      @test_run.save!
    end

    api! 'Restore (unarchive) test run.'
    def restore
      @test_run.remove_attribute(:archived_at)
      @test_run.save!
    end

    api! 'Diff two test runs.'
    param :id1, String, desc: 'first test run id', required: true
    param :id2, String, desc: 'second test run id', required: true
    def diff
      tr1 = TestRun.find(params[:id1])
      tr2 = TestRun.find(params[:id2])
      @prev, @current = [tr1, tr2].sort_by(&:start).map(&:test_cases)
    end

    api! 'Create a new test run.'
    param :name, String, desc: 'test run name', required: true
    param :status, String, desc: 'test run current status', required: true
    param :start, String, desc: 'start time in milliseconds, default set to now'
    description <<-EOS
Create a new test run.
    EOS
    example <<-EOS
# if success, status: 200
id: 1234567
# if error, status: 422
message: something went wrong
    EOS
    def create
      project = Project.find(params[:project_id])
      start_time = params[:start] || Time.zone.now
      @test_run = project.test_runs.build(name: params[:name], start: start_time, status: params[:status])
      @test_run.save!
    end

    api! 'Stop the run.'
    param :stop, String, desc: 'stop time in milliseconds, default set to now'
    def stop
      stop = params[:stop] || Time.zone.now
      @test_run.update_attributes!(
        stop: stop,
        status: 'done'
      )
    end

    api! 'Update existing test run.'
    param :name, String, desc: 'test run name'
    param :status, String, desc: 'test run current status'
    param :start, String, desc: 'start time in milliseconds, default set to now'
    param :stop, String, desc: 'stop time in milliseconds, default set to now'
    def update
      @test_run.start = Time.at(params[:start].to_i / 1000.0) if params[:start]
      @test_run.stop = Time.at(params[:stop].to_i / 1000.0) if params[:stop]
      @test_run.status = params[:status] if params[:status]
      @test_run.save! if @test_run.changed?
    end

    api! 'Merge test runs.'
    param :ids, Array, desc: 'test run ids to merge with', required: true
    param :name, String, desc: 'new name for the merged run'
    def merge
      @test_run = TestRun.find(params[:ids][0])
      rest = params[:ids][1..-1]
      rest.each do |id|
        test_run = TestRun.find(id)
        @test_run.merge! test_run
      end
      @test_run.name = params[:name] if params[:name]
      @test_run.save! if @test_run.changed?
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
