module Api
  class TestRunsController < Api::BaseController
    before_action :set_resource, only: [:progress, :detail, :archive, :restore]

    def detail
      # @test_cases = @test_run.test_cases
      # @test_cases = []
      # @test_run.test_suites.each do |ts|
      #   ts.test_cases.each do |tc|
      #     tc[:test_suite] = ts
      #     @test_cases << tc
      #   end
      # end
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

    def diff
      tr1 = TestRun.find(params[:left])
      tr2 = TestRun.find(params[:right])
      @prev, @current = [tr1, tr2].sort_by(&:start).map(&:test_cases)
      # changes = {}
      # processed = []
      # tr1 = TestRun.find(params[:left])
      # tr2 = TestRun.find(params[:right])
      # base, target = [tr1, tr2].sort_by(&:start).map(&:test_cases)
      # target.each do |tc|
      #   old = base.select { |x| x.get_md5 == tc.get_md5 }
      #   if old.size > 0
      #     if old[0][:status] != tc[:status]
      #       key = "newly #{tc[:status]}"
      #       changes[key] ||= []
      #       tc[:prev] = old[0]
      #       changes[key] << tc
      #     end
      #   else
      #     key = 'new test cases'
      #     changes[key] ||= []
      #     changes[key] << tc
      #   end
      #   processed << tc.get_md5
      # end
      # missing = base.select { |x| !processed.include?(x.get_md5) }
      # changes['missing test cases'] = missing if missing.size > 0
      # @changes = changes
      # respond_with changes
    end

    def order_params
      { sn: 'desc' }
    end

    def query_params
      custom_params = params.permit(:project, :type, :archived)
      archived = custom_params.delete(:archived)
      custom_params[:archived_at.exists] = archived
      custom_params
    end
  end
end
