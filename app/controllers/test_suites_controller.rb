class TestSuitesController < ApplicationController
  def index
  end

  def show
    @test_suite = TestSuite.find(params[:id])
  end
end
