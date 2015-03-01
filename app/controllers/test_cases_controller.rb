class TestCasesController < ApplicationController
  def index
  end

  def show
    @test_case = TestCase.find(params[:id])
  end
end
