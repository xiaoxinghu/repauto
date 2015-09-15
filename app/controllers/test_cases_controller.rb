class TestCasesController < ApplicationController
  def index
  end

  def fetch
    if params[:id]
      @selected = [ TestCase.find(params[:id]) ]
    end
    if params[:ids]
      puts params[:ids]
      ids = params[:ids].split('/')
      @selected = TestCase.find(ids).to_a
    end
    respond_to do |format|
      format.js
    end
  end

  def fetch_history
    @test_case = TestCase.find(params[:id])
    same_name = TestCase
                .where(name: @test_case.name)
                .where(:id.ne => @test_case.id)
                .sort(start: -1).to_a
    @history = same_name.select { |c| @test_case.get_md5 == c.get_md5 }.first(10)
    respond_to do |format|
      format.js
    end
  end


  def show
    @test_cases = []
    if params[:id] == 'diff'
      @name = params[:name]
      @test_cases = []
      if params[:type] == 'all' || !params[:selected]
        ids = params[:all].split
      else
        ids = params[:selected].reject(&:blank?)
        ids = params[:all].split if ids.empty?
      end
      ids.each do |id|
        @test_cases << TestCase.find(id)
      end
    else
      @test_cases << TestCase.find(params[:id])
    end
    # @test_cases = [TestCase.find(params[:id])]
    # return if params[:with].blank?
    # params[:with].each do |id|
    #   @test_cases << TestCase.find(id)
    # end
  end

  def diff_images
    ids = params[:ids].split('/')
    @test_cases = TestCase.find(ids).to_a
    @images = optimize_for_diff_images @test_cases
    # @images = @test_cases.map { |tc| optimize_for_diff_images tc }

    respond_to do |format|
      format.js
    end
  end

  def comment
    puts params
    id = params[:test_case_id]
    test_case = TestCase.find(id)
    comment = {
      name: params[:name],
      status: params[:status],
      comment: params[:comment],
      time: Time.zone.now
    }
    test_case[:comments] ||= []
    test_case.push(comments: comment)
    test_case.save!
    respond_to do |format|
      format.js
    end
  end

  private

  def optimize_for_diff_images(test_cases)
    optimized = []
    test_cases.each do |tc|
      atts = tc[:attachments] || []
      atts = [atts] if atts.is_a? Hash
      images = atts.select { |a| a[:type] =~ /image/ }
      images.each_with_index do |image, index|
        optimized[index] ||= []
        optimized[index] << {
          test_case: tc,
          link: tc.get_att_link(image),
          title: image[:title]
        }
      end
    end
    # optimized = {
    #   test_case: test_case,
    #   images: []
    # }
    # atts = test_case[:attachments]
    # atts = [atts] if atts.is_a? Hash
    # images = atts.select { |a| a[:type] =~ /image/ }
    # images.each do |image|
    #   optimized[:images] << {
    #     link: test_case.get_att_link(image),
    #     title: image[:title]
    #   }
    # end

    optimized
  end

  def status
    test_case = TestCase.find(params[:id])
    
  end
end
