require './config/environment'
require './datacraft/model_plugins/attachment_plugin'
require './datacraft/model_plugins/test_case_plugin'

set :benchmark, true
set :parallel, true

class AttachmentsToProcess
  def each
    Attachment.where(type: :test_suite).where(processed: false).each do |a|
      yield a
    end
  end
end

class AttachmentProcessor
  def <<(row)
    TestCase.parse row
    row.processed = true
    row.save!
  end
end

from AttachmentsToProcess

tweak do |row|
  puts row.file_name
  row
end

to AttachmentProcessor
