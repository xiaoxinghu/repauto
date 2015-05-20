class Tag < ActiveRecord::Base
  belongs_to :test_case

  def self.get_all(key: nil)
    query = all.select(:value)
    if key
      query = query.where(name: key).distinct.map(&:value)
    end
    query.distinct.map(&:value)
  end
end
