class Project
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  include Mongoid::Timestamps

  has_many :test_runs, dependent: :delete do
    def active
      exists(archived_at: false)
    end

    def archived
      exists(archived_at: true)
    end
  end

  def run_types
    test_runs.active.distinct('name')
  end
end
