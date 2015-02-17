class ReportsController < ApplicationController
  def index
    #@project = Project.find(params[:project_id])
    #@reports = Report.under(@project)

    # tags = []
    # tags << params[:stream] if params[:stream].present?
    # tags << params[:project] if params[:project].present?
    # tags << params[:category] if params[:category].present?
    # tags << params[:type] if params[:type].present?

    # @reports = Report.all.select{ |report| (tags - report.tags).empty? }
    @project = Project.find(params[:project_id])
    @reports = @project.reports
  end

  def show
  end
end
