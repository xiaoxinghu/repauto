class TestRunsController < ApplicationController
  def index
    @project = Project.find(params[:project_id])
  end

  def show
    @test_run = TestRun.find(params[:id])
  end
end
