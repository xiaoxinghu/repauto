class DashboardsController < ApplicationController
  def index
    @stream = Stream.find(params[:stream_id])
    @project = @stream.project(params[:project_id])
    @dashboards = @project.dashboards
  end

  def show
  end
end
