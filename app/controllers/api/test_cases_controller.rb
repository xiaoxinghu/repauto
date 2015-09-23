module Api
  class TestCasesController < Api::BaseController
    before_action :set_resource, only: [:archive, :history]

    def history
      same_name = TestCase
                  .where(name: @test_case.name)
                  .where(:id.ne => @test_case.id)
                  .sort(start: -1).to_a
      @history = same_name.select { |c| @test_case.get_md5 == c.get_md5 }.first(10)
    end
  end
end
