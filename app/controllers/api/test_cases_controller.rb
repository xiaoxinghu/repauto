module Api
  class TestCasesController < Api::BaseController
    before_action :set_resource, only: [:archive, :history, :comment]
    skip_before_filter :verify_authenticity_token

    api! 'List all test cases under test run.'
    def index
      test_run = TestRun.find(params[:test_run_id])
      @test_cases = test_run.test_cases
        .where(query_params)
    end

    api! 'Get history of test case.'
    def history
      test_case_def = @test_case.definition
      @history = TestCase
      .where(def_id: test_case_def.id)
      .where(:start.lt => @test_case.start)
      .sort(start: -1)
      .limit(10)
    end

    api! 'Create a test case.'
    param :name, String, desc: 'name', required: true
    param :status, String, desc: 'name', required: true
    param :start_time, String, desc: 'name', required: true
    param :stop_time, String, desc: 'name', required: true
    param :tags, Array, desc: 'name', required: true
    param :test_suite, String, desc: 'test suite name', required: true
    param :steps, Array, desc: 'steps', required: true do
      param :name, String, desc: 'name of the step', required: true
      param :start_time, String, desc: 'name of the step', required: true
      param :stop_time, String, desc: 'name of the step', required: true
      param :status, ['passed', 'failed', 'broken', 'pending'], desc: 'name of the step', required: true
    end
    def create
      puts "creating test case: #{params}"
    end

    api! 'Comment on a test case.'
    param :user, String, desc: 'user identity', required: true
    param :status, ['passed', 'failed'], desc: 'new status', required: true
    param :comment, String, desc: 'comment content', required: true
    def comment
      puts "got body: #{request.body.read}"
      comment = Comment.new(
        user: params[:user],
        status: params[:status],
        comment: params[:comment]
      )
      @test_case.comments.push comment
      @test_case.save!
      test_run = @test_case.test_run
      test_run.dirty = true
      test_run.save!
    end
  end
end
