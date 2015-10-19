class ProjectsController < ApplicationController

  def index
  end

  def show
    @project = Project.find(params[:id])
    @types = @project.test_runs.active.distinct('name')
  end

  def trend
    @project = Project.find(params[:id])
    @types = @project.test_runs.active.distinct('name')
  end
end
