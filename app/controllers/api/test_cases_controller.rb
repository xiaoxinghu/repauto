module Api
  class TestCasesController < Api::BaseController
    before_action :set_resource, only: [:archive, :history, :comment]

    def history
      test_case_def = @test_case.definition
      @history = TestCase
                 .where(def_id: test_case_def.id)
                 .where(:start.lt => @test_case.start)
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
