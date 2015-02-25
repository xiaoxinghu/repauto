class TestRunsController < ApplicationController
  def index
    @project = Project.find(params[:project_id])
    @test_runs = TestRun.where(project: @project)
  end

  def show
  end
end
