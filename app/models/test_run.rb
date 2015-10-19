class TestRun
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  has_many :attachments, dependent: :delete
  belongs_to :project
  has_many :test_cases, dependent: :delete

  field :name, type: String
  field :start, type: Time
  field :stop, type: Time
  field :status, type: String
  field :dirty, type: Boolean, default: -> { true }
  embeds_one :report
  paginates_per 20

  def gen_report
    return report if has_report? && !dirty
    self.report = Report.gen(self)
    self.dirty = false
    self.save!
    report
  end
end
