class Tag < ActiveRecord::Base
  belongs_to :test_case

  def self.get_all(key)
    all.select(:value).where(name: key).distinct.map(&:value)
  end
end
