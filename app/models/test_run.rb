class TestRun
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  has_many :attachments
  belongs_to :project
  has_many :test_cases, autosave: true

  field :name, type: String
  field :start, type: Time
  field :stop, type: Time
  field :status, type: String
  paginates_per 20

  def todo
    total = 0
    test_suites.each do |ts|
      total += ts.test_results
               .where(:status.ne => :passed)
               .exists(:comments.with_size => 0)
               .size
    end
    # test_results.where(:status.ne => :passed).exists(comments: false).count
    total
  end

  def counts
    return self[:counts] if self[:counts]
    counts = {}
    test_suites.each do |ts|
      ts.test_results.each do |tr|
        counts[tr.status] ||= 0
        counts[tr.status] += 1
      end
    end
    self[:counts] = counts
    save!
    counts
  end

  def get_start_time
    test_suites.min(:start)
  end

  def get_stop_time
    test_suites.max(:stop)
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
