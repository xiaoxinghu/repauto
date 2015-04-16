class TestRunsController < ApplicationController
  include Filter

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
    @group = @test_cases.select(&:failure).group_by { |tc| group_error_message tc.failure.message }
  end

  UUID = /\A([0-9a-fA-F]{32}|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\z/

  def group_error_message(message)
    # grouped = message
    # if ['time out', 'timeout'].any? { |word| message.include? word }
    #   grouped = 'time out'
    # end
    # grouped
    message.gsub(UUID, '<UUID>')
  end

  def timeline
    @test_run = TestRun.find(params[:id])
    query = TestCase.all.where(test_suite: @test_run.test_suites)
    @test_cases = query.order('start')
    @timeline_data = []
    @test_cases.each_with_index do |test_case, i|
      lane = 'N/A'
      if test_case.status == 'passed'
        lane = 'passed'
      elsif test_case.status == 'failed'
        lane = 'failed'
      elsif test_case.status == 'pending'
        lane = 'pending'
      elsif test_case.failure
        lane = group_error_message test_case.failure.message
      end
      # fix bad data
      if test_case.end > test_case.test_suite.end || test_case.end < test_case.test_suite.start
        if i == @test_cases.size - 1
          test_case.end = test_case.test_suite.end
        else
          test_case.end = @test_cases[i + 1].start
        end
      end
      if test_case.start > test_case.test_suite.end || test_case.start < test_case.test_suite.start
        if i == 0
          test_case.start = test_case.test_suite.start
        else
          test_case.start = @test_cases[i - 1].end
        end
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
    # @timeline_data.sort_by! { |k| k[:start] }
    # @timeline_data.each_with_index do |i, d|
    #   if invalid_time d[:end]
    #     if i == @timeline_data.size - 1
    #       d[:end] = d[:start]
    #     else
    #       d[:end] = @timeline_data[i + 1][:start]
    #     end
    #   end
    # end
  end

  def trend
    @project = Project.find(params[:project_id])
    @trend_data = []

    test_runs = filter @project.test_runs, params[:run_type], 30
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
