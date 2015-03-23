class TestRunsController < ApplicationController

  def index
    @project = Project.find(params[:project_id])
    query = @project.test_runs
    query = query.where.not(start: nil).where.not(end: nil)
    if params[:category] && !params[:category].blank?
      query = query.where(name: params[:category])
    end
    if params[:seconds] && !params[:seconds].blank?
      query = query.where(start: (Time.now - params[:seconds].to_i.seconds)..Time.now)
    end
    if params[:duration] && !params[:duration].blank?
      query = query.select { |tr| (tr.end - tr.start) > params[:duration].to_i }
    end
    if params[:number] && !params[:number].blank?
      query = query.select { |tr| tr.count > params[:number].to_i }
    end

    if query.respond_to? 'order'
      query = query.order('start DESC')
    elsif query.respond_to? 'sort_by!'
      query.sort_by!(&:start).reverse!
    end
    @test_runs = Kaminari.paginate_array(query).page(params[:page]).per(10)
  end

  def show
    @test_run = TestRun.find(params[:id])
  end

  def errors
    @test_run = TestRun.find(params[:id])
    query = TestCase.all.where(test_suite: @test_run.test_suites)
    query = query.order('start DESC')
    @test_cases = query
    @group = @test_cases.select(&:failure).group_by { |tc| tc.failure.message }
  end

  def timeline
    @test_run = TestRun.find(params[:id])
  end

end
