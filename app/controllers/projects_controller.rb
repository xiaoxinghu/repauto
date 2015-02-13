class ProjectsController < ApplicationController
  def index
  end

  def show
    @project = Project.find(params[:id])
  end
end
