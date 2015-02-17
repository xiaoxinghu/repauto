class DashboardsController < ApplicationController
  def index
    @project = Project.find(params[:project_id])
    @dashboards = @project.dashboards
  end

  def show
  end
end
