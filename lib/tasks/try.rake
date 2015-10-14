namespace :try do
  task t: :environment do
    Mongoid.logger.level = Logger::WARN
    Mongo::Logger.logger.level = Logger::WARN
    # image = Attachment.where(tags: 'attachment').first
    # image = Attachment.where(tags: 'testsuite').first
    # IO.binwrite('bin.xml', image.data.data)
    # puts image.data.data

    # image = Attachment.where(tags: 'image').first
    # tr = image.test_run
    # tr.attachments.each do |a|
    #   puts a.file_name
    # end

    ts = Attachment.where(tags: 'testsuite').first
    suite = TestSuite.parse ts
    pp suite

    # ts = TestSuite.first
    # pp ts
    # pp ts.test_run
    # pp ts.test_results
  end

  task a: :environment do
    Mongoid.logger.level = Logger::WARN
    Mongo::Logger.logger.level = Logger::WARN
    suite = TestSuite.first
    puts suite.test_results.size
  end

  task get_image: :environment do
    img = Attachment.where(tags: 'image').first
    IO.binwrite('img.jpeg', img.data.data)
  end

  task count: :environment do
    counts = {}
    TestRun.first.test_suites.each do |ts|
      ts.test_results.each do |tr|
        counts[tr.status] ||= 0
        counts[tr.status] += 1
      end
    end
    pp counts
  end
end
