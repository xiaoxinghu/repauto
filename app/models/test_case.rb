class TestCase
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic

  def self.from(test_suite)
    where(path: /#{test_suite.path}/)
  end

  def tags
    return @tags if @tags
    @tags = []
    self[:'parameters.parameter'].each do |p|
      @tags << p[:value]
    end
    @tags
  end


  # def inspect
  #   %(
  #   name: #{name}
  #   duration: #{distance_of_time_in_words self.stop, start}
  #   )
  # end

end
