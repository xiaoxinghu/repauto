class TestRunsController < ApplicationController
  def index
    @project = Project.find(params[:project_id])
    query = @project.test_runs
    query = query.where.not(start: nil).where.not(end: nil)
    if params[:category] and not params[:category].blank?
      query = query.where(name: params[:category])
    end
    if params[:seconds]
      query = query.where(start: (Time.now - params[:seconds].to_i.seconds)..Time.now)
    end
    if params[:duration]
      query = query.select { |tr| (tr.end - tr.start) > params[:duration].to_i }
    end
    if params[:number]
      query = query.select { |tr| tr.count > params[:number].to_i }
    end

    query = query.order("start DESC")
    @test_runs = query.page params[:page]
  end

  def show
    @test_run = TestRun.find(params[:id])
  end
end
