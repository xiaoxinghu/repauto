class ProjectsController < ApplicationController
  def index
  end

  def show
    @show_num = 2
    @min_duration = 30.minutes
    @matrix = {}
    @project = Project.find(params[:id])
    categories = @project.test_runs.select(:name).distinct.map(&:name)
    categories.each do |c|
      @matrix[c] = @project.test_runs
                   .where.not(end: nil)
                   .where(name: c)
                   .select { |tr| (tr.end - tr.start) > @min_duration }
                   .sort_by!(&:start)
                   .reverse!.take(@show_num)
    end
    @sorted_c = @matrix
                .sort_by { |_k, v| v[0] ? -v[0].count : 1 }
                .map { |x| x[0] }
  end

  def sync
    SyncJob.perform_async
  end

  private
  def redis
    @redis ||= Redis.new
  end
end
