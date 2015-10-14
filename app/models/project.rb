class Project
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  has_many :test_runs, dependent: :delete do
    def active
      exists(archived_at: false)
    end

    def archived
      exists(archived_at: true)
    end
  end
  has_many :test_case_defs, dependent: :delete

  # field :path, type: String

  def run_types
    test_runs.active.distinct('name')
  end
end
