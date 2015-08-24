class TestCasesController < ApplicationController
  def index
  end

  def fetch
    if params[:id]
      @selected = [ TestCase.find(params[:id]) ]
    end
    if params[:ids]
      puts params[:ids]
      ids = params[:ids].split('/')
      @selected = TestCase.find(ids).to_a
    end
    respond_to do |format|
      format.js
    end
  end

  def fetch_history
    @test_case = TestCase.find(params[:id])
    @history = TestCase
               .where(name: @test_case.name)
               .sort(start: -1)
               .limit(10)
    respond_to do |format|
      format.js
    end
  end

  def show
    @test_cases = []
    if params[:id] == 'diff'
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
    else
      @test_cases << TestCase.find(params[:id])
    end
    # @test_cases = [TestCase.find(params[:id])]
    # return if params[:with].blank?
    # params[:with].each do |id|
    #   @test_cases << TestCase.find(id)
    # end
  end
end
