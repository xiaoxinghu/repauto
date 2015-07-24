class ProjectsController < ApplicationController
  include Filter

  def index
  end

  def show
    @show_num = 2
    @project = Project.find(params[:id])
  end

  def sync
    SyncJob.perform_async
  end

  private
  def redis
    @redis ||= Redis.new
  end
end
