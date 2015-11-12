class FileValidator < Apipie::Validator::BaseValidator

  def validate(value)
    value.is_a?(Rack::Test::UploadedFile) || value.is_a?(ActionDispatch::Http::UploadedFile)
  end

  def self.build(param_description, argument, options, block)
    self.new param_description if argument == File
  end

  def description
    'Must be a valid file'
  end

end
