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

    # fix bad data
    @timeline_data.sort_by! { |k| k[:start] }
    @timeline_data.each_with_index do |i, d|
      if invalid_time d[:end]
        if i == @timeline_data.size - 1
          d[:end] = d[:start]
        else
          d[:end] = @timeline_data[i + 1][:start]
        end
      end
    end
  end

  def invalid_time(time)
    time == 0
  end

  def trend
    @project = Project.find(params[:project_id])
    @trend_data = []

    @plot_amount =  30
    @sample_amount = 10
    @max_run = 0
    @min_proportion = 0.5

    test_runs = @project.test_runs
                .where.not(start: nil)
                .where.not(end: nil)
                .where(name: params[:run_type])
                .order('start DESC')
                #.last(@plot_amount)

    # filter out small runs
    # sample_period = 7.days
    # sample = test_runs.select do |r|
    #   Time.now - r.start < sample_period
    # end
    # puts "got #{sample.count} items for last #{sample_period}"
    sample = test_runs.first(@sample_amount)
    puts "got #{sample.count} items out of #{test_runs.count}"

    @max_run = sample.max_by { |r| r.count }.count
    puts "max value: #{@max_run}"

    chosen = test_runs.select{ |r| r.count > @max_run * @min_proportion }
    puts "resulting in #{chosen.count} items"
    chosen.first(@plot_amount).each do |tr|
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
