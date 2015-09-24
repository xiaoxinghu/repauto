module Api
  class TestRunsController < Api::BaseController
    before_action :set_resource, only: [:progress, :test_cases, :archive, :restore]

    def test_cases
      @test_cases = @test_run.test_cases
      @test_cases = []
      @test_run.test_suites.each do |ts|
        ts.test_cases.each do |tc|
          tc[:test_suite] = ts
          @test_cases << tc
        end
      end
    end

    def progress
      respond_with get_resource
    end

    def archive
      @test_run.update_attributes(archived_at: Time.zone.now)
      @test_run.save!
    end

    def restore
      @test_run.remove_attribute(:archived_at)
      @test_run.save!
    end

    def order_params
      { start: 'desc' }
    end

    def query_params
      custom_params = params.permit(:project_path, :archived)
      puts "------ #{custom_params}"
      archived = custom_params.delete(:archived)
      custom_params[:archived_at.exists] = archived
      custom_params
    end
  end
end
