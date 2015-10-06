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
      comment = {
        name: params[:name],
        status: params[:status],
        comment: params[:comment]
      }
      @test_case[:comments] ||= []
      @test_case.push(comments: comment)
      @test_case.save!
    end
  end
end
