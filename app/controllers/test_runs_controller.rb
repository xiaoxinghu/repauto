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
    query = TestCase.all.where(test_suite: @test_run.test_suites)
    @test_cases = query
    @timeline_data = []
    @test_cases.each do |test_case|
      lane = 'N/A'
      if test_case.status == 'passed'
        lane = 'passed'
      elsif test_case.status == 'failed'
        lane = 'failed'
      elsif test_case.failure
        lane = test_case.failure.message
      end
      d = { id: test_case.id,
            name: test_case.name,
            lane: lane,
            start: test_case.start,
            end: test_case.end,
            url: Rails.application.routes.url_helpers.test_case_path(test_case),
            status: test_case.status,
            desc: test_case.inspect }
      @timeline_data << d
    end
  end

  def trend
    @project = Project.find(params[:project_id])
    @trend_data = []

    plot_amount =  30
    test_runs = @project.test_runs
                .where.not(start: nil)
                .where.not(end: nil)
                .where(name: params[:run_type])
                .select { |tr| (tr.end - tr.start) > 30.minutes }
                .sort_by!(&:start).reverse!
                .last(plot_amount)

    # filter out small runs
    # sample_period = 7.days
    # sample = test_runs.select do |r|
    #   Time.now - r.start < sample_period
    # end
    # puts "got #{sample.count} items for last #{sample_period}"
    sample_amount = 10
    sample = test_runs.last(sample_amount)
    puts "got #{sample.count} items out of #{test_runs.count}"

    max = sample.max_by { |r| r.count }.count
    puts "max value: #{max}"

    test_runs.reject!{ |r| r.count < max * 0.5 }
    puts "resulting in #{test_runs.count} items"
    test_runs.each do |tr|
      ['passed', 'failed', 'broken'].each do |s|
        @trend_data << {
            time: tr.start,
            date: tr.start.to_date,
            status: s,
            number: tr.count(s)
        }
      end
    end
    # @trend_data = test_runs.map { |tr|
    #   { time: tr.start,
    #     pass: tr.count('passed'),
    #     failed: tr.count('failed'),
    #     broken: tr.count('broken')
    #   }
    # }

  end

end
