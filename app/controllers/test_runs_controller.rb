class TestRunsController < ApplicationController
  def index
    @project = Project.find(params[:project_id])
    query = @project.test_runs
    query = query.where.not(start: nil).where.not(end: nil)
    if params[:category] and not params[:category].blank?
      query = query.where(name: params[:category])
    end
    if params[:seconds] and not params[:seconds].blank?
      query = query.where(start: (Time.now - params[:seconds].to_i.seconds)..Time.now)
    end
    if params[:duration] and not params[:duration].blank?
      query = query.select { |tr| (tr.end - tr.start) > params[:duration].to_i }
    end
    if params[:number] and not params[:number].blank?
      query = query.select { |tr| tr.count > params[:number].to_i }
    end

    if query.respond_to? 'order'
      query = query.order("start DESC")
    elsif query.respond_to? 'sort_by!'
      query.sort_by! { |x| x.start }.reverse!
    end
    @test_runs = Kaminari.paginate_array(query).page(params[:page]).per(10)
  end

  def show
    @test_run = TestRun.find(params[:id])
  end
end
