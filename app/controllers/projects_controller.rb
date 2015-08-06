class ProjectsController < ApplicationController
  include Filter

  def index
  end

  def show
    @project = Project.find(params[:id])
  end

  def trend
    @project = Project.find(params[:id])
    @types = TestRun.from(@project).distinct('type')
  end

  def fetch_trend
    @project = Project.find(params[:id])
    ratio = params[:filter] ? params[:filter].to_i / 100.0 : 0.5
    samples = TestRun
              .where(project_path: @project.path)
              .where(type: params[:category])
              .exists(archived_at: false)
              .exists(summary: true)
              .sort(start: -1)
              .limit(10)
    max = samples.max_by { |s| s.summary.values.sum }.summary.values.sum
    @trend_data = []
    test_runs = TestRun
                .where(project_path: @project.path)
                .where(type: params[:category])
                .exists(archived_at: false)
                .exists(summary: true)
                .sort(start: -1)

    counter = 0
    test_runs.each do |tr|
      break if counter > 30
      next if tr[:summary].values.sum < (max * ratio)
      %w(passed failed broken pending).each do |s|
        start = Time.at(tr.start / 1000.0)
        @trend_data << {
          time: start,
          date: start.to_date,
          status: s,
          number: tr[:summary][s]
        }
      end
      counter += 1
    end
    respond_to do |format|
      format.js
    end
    # @trend_data = test_runs.map { |tr|
    #   { time: tr.start,
    #     pass: tr.count('passed'),
    #     failed: tr.count('failed'),
    #     broken: tr.count('broken')
    #   }
    # }
  end

  private
  def redis
    @redis ||= Redis.new
  end
end
