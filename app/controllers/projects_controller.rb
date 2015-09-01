class ProjectsController < ApplicationController
  include Filter

  def index
  end

  def show
    @project = Project.find(params[:id])
    @types = TestRun.from(@project).exists(archived_at: false).distinct('type')
  end

  def fetch_history
    @project = Project.find(params[:id])
    @type = params[:type]
    @history = get_history(@project, @type)
    @history_data = to_data(@history)
    respond_to do |format|
      format.js
    end
  end

  def get_history(project, type, amount: 30, sample_amount: 10, ratio: 0.5)
    samples = project.test_runs
              .where(type: type)
              .exists(archived_at: false)
              .exists(summary: true)
              .sort(start: -1)
              .limit(sample_amount)
    return [] unless samples.count > 0
    max = samples.max_by { |s| s.summary.values.sum }.summary.values.sum
    test_runs = project.test_runs
                .where(type: type)
                .exists(archived_at: false)
                .exists(summary: true)
                .sort(start: -1)

    history = []
    test_runs.each do |tr|
      break if history.size > amount
      next if tr[:summary].values.sum < (max * ratio)
      history << tr
    end
    history
  end

  def trend
    @project = Project.find(params[:id])
    @types = TestRun.from(@project).exists(archived_at: false).distinct('type')
  end

  def fetch_trend
    @project = Project.find(params[:id])
    ratio = params[:filter] ? params[:filter].to_f / 100.0 : 0.5
    history = get_history(@project, params[:type], ratio: ratio)
    @trend_data = to_data(history)
    respond_to do |format|
      format.js
    end
  end

  private
  def redis
    @redis ||= Redis.new
  end

  def to_data(history)
    data = []
    history.each do |tr|
      start = Time.at(tr.start / 1000.0)
      d = {
        time: start,
        date: start.to_date
      }
      d.merge!(patch tr[:summary])
      data << d
    end
    data
  end

  def patch(summary)
    patched = summary.clone
    %w(passed failed broken pending).each do |s|
      patched[s] ||= 0
    end
    patched
  end
end
