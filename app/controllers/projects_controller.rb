class ProjectsController < ApplicationController
  def index
  end

  def show
    @show_num = 2
    @matrix = {}
    @project = Project.find(params[:id])
    categories = @project.test_runs.select(:name).distinct.map(&:name)
    categories.each do |c|
      @matrix[c] = @project.test_runs.where.not(end: nil).where(name: c).select { |tr| (tr.end - tr.start) > 30.minutes }.sort_by!(&:start).reverse!.take(@show_num)
    end
  end
end
