class TestCasesController < ApplicationController
  def index
  end

  def show
    @test_case = TestCase.find(params[:id])
  end

  def diff
    @test_case = TestCase.find(params[:id])
    @target = TestCase.find(params[:target_id])
  end
end
