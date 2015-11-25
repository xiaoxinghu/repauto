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
end
