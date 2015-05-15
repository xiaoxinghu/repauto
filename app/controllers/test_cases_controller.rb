class TestCasesController < ApplicationController
  def index
  end

  def show
    @test_cases = []
    params[:id].split('/').each do |id|
      @test_cases << TestCase.find(id)
    end
    # @test_cases = [TestCase.find(params[:id])]
    # return if params[:with].blank?
    # params[:with].each do |id|
    #   @test_cases << TestCase.find(id)
    # end
  end

  def diff
    #@test_case = TestCase.find(params[:id])
    #@target = TestCase.find(params[:target_id])
    @name = params[:name]
    @test_cases = []
    if params[:type] == 'all' || !params[:selected]
      ids = params[:all].split
    else
      ids = params[:selected].reject(&:blank?)
      ids = params[:all].split if ids.empty?
    end
    ids.each do |id|
      @test_cases << TestCase.find(id)
    end
  end
end
