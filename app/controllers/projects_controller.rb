class ProjectsController < ApplicationController
  def index
  end

  def show
    @show_num = 2
    @min_duration = 30.minutes
    @matrix = {}
    @project = Project.find(params[:id])
    #categories = @project.test_runs.select(:name).distinct.map(&:name)
    #categories = @project.test_runs.distinct.pluck(:name)
    #categories = TestRun.where(project: @project).distinct.pluck(:name)
    #cat_count = TestRun.where(project: @project).group(:name).count
    cat_count = TestRun.joins(test_suites: :test_cases).where(project: @project).group('test_runs.name').count
    categories = cat_count.sort_by { |_k, v| -v }.map { |x| x[0] }
    categories.each do |c|
      @matrix[c] = @project.test_runs
                   .where.not(end: nil)
                   .where(name: c)
                   .select { |tr| (tr.end - tr.start) > @min_duration }
                   .sort_by!(&:start)
                   .reverse!.take(@show_num)
    end

    #@matrix = @project.test_runs.group(:name)
    # @sorted_c = @matrix
    #             .sort_by { |_k, v| v[0] ? -v[0].count : 1 }
    #             .map { |x| x[0] }
    #@sorted_c = @matrix.map { |x| x[0] }
  end

  def sync
    SyncJob.perform_async
  end

  private
  def redis
    @redis ||= Redis.new
  end
end
