class TestRun
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  include Mongoid::Timestamps
  has_many :attachments, dependent: :delete
  belongs_to :project
  has_many :test_cases, dependent: :delete, after_add: :mark_dirty

  field :name, type: String
  field :start, type: Time
  field :stop, type: Time
  field :status, type: String
  field :dirty, type: Boolean, default: -> { true }
  embeds_one :report, autobuild: true
  paginates_per 20

  before_save do |doc|
    if doc.dirty
      doc.report = Report.gen(doc)
      doc.dirty = false
      doc
    end
  end

  def mark_dirty(doc)
    self.dirty = true
  end

  # Merge test_run with this one. will delete test_run from db
  def merge!(test_run)
    test_run.test_cases.each do |test_case|
      test_cases.push test_case
      test_case.save!
    end
    test_run.attachments.each do |attachment|
      attachments.push attachment
      attachment.save!
    end
    self.start = test_run.start if test_run.start < self.start
    self.stop = test_run.stop if test_run.stop > self.stop
    self.save! if self.changed?
    test_run.destroy
  end
end
