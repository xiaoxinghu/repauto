module ParamTool
  extend ActiveSupport::Concern

  def validate_params(expected, params)
    expected.each do |param|
      raise "Need parameter '#{param}'" unless params[param]
    end
  end
end
