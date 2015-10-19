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

  def todo
    test_cases
      .where(:status.ne => :passed)
      .exists(:comments.with_size => 0)
      .size
  end

  def gen_report
    return report if has_report? && !dirty
    self.report = Report.gen(self)
    self.dirty = false
    self.save!
    report
  end

  def counts
    # if self[:counts] && self[:dirty] == false
    #   return self[:counts]
    # end
    return self[:counts] if self[:counts]
    counts = {}
    test_cases.each do |tc|
      counts[tc.status] ||= 0
      counts[tc.status] += 1
    end
    self[:counts] = counts
    save!
    counts
  end

  private

  def summary_with_passrate
    swp = self[:summary].clone
    add_pass_rate swp
  end

  def manual_summary
    return {} unless self[:summary]
    summary = self[:summary].clone
    commented = test_cases.exists(comments: true)
    commented.each do |tc|
      new_status = tc[:comments].last[:status] || tc[:status]
      old_status = tc[:status]
      if new_status != old_status
        summary[new_status] ||= 0
        summary[new_status] += 1
        summary[old_status] -= 1
      end
    end
    # add_pass_rate summary
    summary
  end


  def add_pass_rate(summary)
    passed = (summary[:passed] || 0)
    summary[:rate] = passed * 100.0 / summary.values.sum
    summary
  end
end
