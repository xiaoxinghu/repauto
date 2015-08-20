class TestRunsController < ApplicationController
  include Filter
  include TestCasesHelper

  def index
    @project = Project.find(params[:project_id])
    limit = 7.days.ago.to_i * 1000
    collection = TestRun
                 .where(project_path: @project.path)
                 .exists(archived_at: false)
    if params[:type]
      collection = collection.where(type: params[:type])
    end
    query = collection.sort(start: -1)
    patch_summary query
    @run_types = TestRun
                 .where(project_path: @project.path)
                 .exists(archived_at: false).distinct('type')

    @test_runs = Kaminari.paginate_array(query.to_a).page(params[:page]).per(20)
  end

  def patch_summary(test_runs)
    test_runs.each do |tr|
      next unless tr[:synced]
      next if tr[:summary]
      pipline = [
        { '$match': { path: /^#{tr.path}/ } },
        { '$group': { '_id': '$status', count: { '$sum' => 1 } } }
      ]
      counts = TestCase.collection.aggregate(pipline)
      summary = {}
      counts.each do |c|
        summary[c[:_id]] = c[:count]
      end
      tr.update_attributes(summary: summary)
      # summary.each do |s|
      # end
      tr.save!
    end
  end

  def bin
    @project = Project.find(params[:project_id])
    @archived = TestRun
                .where(project_path: @project.path)
                .where(archived_at: { :$gte => 7.days.ago })
                .sort(archived_at: -1)
  end

  def show
    @test_run = TestRun.find(params[:id])
    # @tree = 'the 1st tree'
  end

  def errors
    @test_run = TestRun.find(params[:id])
    query = TestCase.all.where(test_suite: @test_run.test_suites)
    query = query.order('start DESC')
    @test_cases = query
    @group = @test_cases.select(&:failure).group_by { |tc| group_error_message tc.failure.message }
  end

  UUID = /([0-9a-fA-F]{32}|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/

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
            number: filter_test_cases(tr.test_cases, status: s).count
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

  def archive
    id = params[:id]
    test_run = TestRun.find(id)
    test_run.update_attributes(archived_at: Time.zone.now)
    test_run.save!
    # redirect_to project_test_runs_path test_run.project
    respond_to do |format|
      format.js
    end
  end

  def restore
    test_run = TestRun.find(params[:id])
    test_run.remove_attribute(:archived_at)
    test_run.save!
    # redirect_to project_test_runs_path test_run.project
    respond_to do |format|
      format.js
    end
  end

  def ra
    @test_run = TestRun.find(params[:id])
    @ra_summary = @test_run[:summary].clone
    history = TestRun.where(project_path: @test_run.project_path,
                            type: @test_run.type,
                            :start.lt => @test_run.start)
              .order_by(start: 'desc')
              .limit(5)
    @test_run.test_cases.where(status: 'broken').each do |tc|
      # tc_steps = tc.steps.map { |s| s[:name] }
      catch :raed do
        history.each do |h|
          h.test_cases.where(name: tc.name, :status.ne => 'broken').each do |htc|
            # htc_steps = htc.steps.map { |s| s[:name] }
            # next unless tc_steps.sort == htc_steps.sort
            @ra_summary[htc.status] ||= 0
            @ra_summary[htc.status] += 1
            @ra_summary['broken'] -= 1
            throw :raed
          end
        end
      end # ared
    end
    passed = @ra_summary[:passed] || 0
    @ra_summary[:rate] = passed * 100.0 / @ra_summary.values.sum

    respond_to do |format|
      format.js
    end
  end

  def make_tree_by_features(test_run)
    tree = []
    TestSuite.from(test_run).each do |ts|
      test_suite = { name: ts.name, test_cases: [] }
      not_passed = 0
      TestCase.from(ts).each do |tc|
        test_case = {
          name: tc.name,
          id: tc.id.to_s,
          status: tc.status }
        test_suite[:test_cases] << test_case
        not_passed += 1 unless tc.status == 'passed'
      end
      test_suite[:tags] = [not_passed] if not_passed > 0
      tree << test_suite
    end
    tree
  end

  def make_tree_by_errors(test_run)
    tree = []
    errors = {}
    TestSuite.from(test_run).each do |ts|
      test_suite = { name: ts.name, test_cases: [] }
      TestCase.from(ts).each do |tc|
        if tc[:failure]
          msg = tc[:failure][:message]
          errors[msg] = [] unless errors.has_key? msg
          errors[msg] << {
            name: tc.name,
            id: tc.id.to_s,
            status: tc.status }
        end
      end
    end
    errors = errors.sort_by { |_k, v| -v.size }
    errors.each do |k, v|
      tree << { name: k, test_cases: v, tags: [v.size] }
    end
    tree
  end

  def make_tree_by_news(test_run)
    tree = []
    TestCase.from_project
  end

  def group_by_feature(test_run)
    group = {}
    test_run.test_suites.each do |ts|
      group[ts.name] = ts.test_cases
    end
    group
  end

  def group_by_errors(test_run)
    group = {}
    test_run.test_cases.each do |tc|
      if tc[:failure]
        msg = tc[:failure][:message]
        group[msg] ||= []
        group[msg] << tc
      end
    end
    sorted = Hash[group.sort_by { |_k, v| -v.size }]
    sorted
  end

  def group_by_diffs(left, right)
    changes = {}
    if left[:start] > right[:start]
      baseline = right
      target = left
    else
      baseline = left
      target = right
    end
    processed = []
    t = target.test_cases.to_a
    b = baseline.test_cases.to_a
    t.each do |tc|
      old = b.select { |x| x[:name] == tc[:name] }
      # old = baseline.test_cases.where(name: tc[:name])
      if old.size > 0
        if old[0][:status] != tc[:status]
          key = "newly #{tc[:status]}"
          changes[key] ||= []
          changes[key] << tc
        end
      else
        changes['new test cases'] ||= []
        changes['new test cases'] << tc
      end
      processed << tc[:name]
    end
    missing = b.select { |x| !processed.include?(x[:name]) }
    changes['missing test cases'] = missing if missing.size > 0
    changes
  end

  def diff
    left = TestRun.find(params[:id])
    right = TestRun.find(params[:baseline])
    if left[:start] > right[:start]
      @baseline = right
      @test_run = left
    else
      @baseline = left
      @test_run = right
    end
  end

  def fetch_tree
    @test_run = TestRun.find(params[:id])
    if params[:group_by]
      case params[:group_by]
      when 'features'
        @tree = group_by_feature @test_run
      when 'errors'
        @tree = group_by_errors @test_run
      when 'diffs'
        @baseline = TestRun.find(params[:baseline])
        @tree = group_by_diffs @baseline, @test_run
      end
    else
      @tree = group_by_feature @test_run
    end
    respond_to do |format|
      format.js
    end
  end
end
