module Api
  class TestResultsController < Api::BaseController
    before_action :set_resource, only: [:archive, :history, :comment]

    def history
      test_case = @test_result.definition
      @history = TestResult
                 .where(test_case_id: test_case.id)
                 .where(:start.lt => @test_result.start)
                 .sort(start: -1)
                 .limit(10)
    end

    def comment
      comment = Comment.new(
        user: params[:user],
        status: params[:status],
        comment: params[:comment]
      )
      @test_result.comments.push comment
      @test_result.save!
    end
  end
end
