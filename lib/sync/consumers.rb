require_relative './utilities'

class TestCasesMongo < MongoClient
  def <<(row)
    tcr = row.clone
    tcr.delete :test_suite
    @client[:test_cases].find(path: row[:path], start: row[:start])
      .update_one(tcr, upsert: true)
  end
end

class TestSuiteMongo < MongoClient
  def <<(row)
    tcr = row.clone
    suite = tcr.delete :test_suite

    return if @client[:test_suites].find(path: suite[:path]).count > 0
    @client[:test_suites].insert_one(suite)
  end

  def each
    @client[:test_suites].find.each do |ts|
      yield ts.to_hash
    end
  end

  def exists?(path)
    @client[:test_suites].find(path: path).count > 0
  end
end

class UpdateTestRunSummary < MongoClient
  def <<(row)
    tr_path = row[:path].split('/allure/')[0]
    @client[:test_runs].find(path: tr_path)
      .update_one('$inc' => { "summary.#{row[:status]}": 1 })
  end
end

class UpdateTestRunTime < MongoClient
  def initialize
    super
    @counter = 0
  end
  def <<(test_run)
    suites = @client[:test_suites].find(path: /^#{test_run[:path]}/).to_a
    puts "suite count: #{suites.size}"
    suites.each do |suite|
      start = suite[:start].to_i
      stop = suite[:stop].to_i
      test_run[:start] = start if !test_run[:start] || test_run[:start] > start
      test_run[:stop] = stop if !test_run[:stop] || test_run[:stop] < stop
    end
    @client[:test_runs].find(path: test_run[:path]).update_one(test_run)
    @counter += 1
    # tr_path = test_suite[:path].split('/allure/')[0]
    # trs = @client[:test_runs].find(path: tr_path)
    #
    # start = test_suite[:start].to_i
    # stop = test_suite[:stop].to_i
    # tr = trs.first
    # if !tr[:start] || tr[:start] > start
    #   tr[:start] = start
    # end
    # if !tr[:stop] || tr[:stop] < stop
    #   tr[:stop] = stop
    # end
    # @client[:test_runs].find(path: tr_path).update_one(tr)
  end

  def build
    puts "--> #{@counter} test run time synced."
  end
end

class ProjectsMongo < MongoClient
  def initialize
    super
    @projects = @client[:projects]
  end

  def each
    @projects.find.each do |p|
      yield p.to_hash
    end
  end

  def <<(row)
    @projects.find(path: row[:path]).replace_one(row, upsert: true)
  end
end

class TestRunsMongo < MongoClient
  def initialize(status = :all)
    super()
    @status = status
    @test_runs = @client[:test_runs]
  end

  def <<(row)
    # puts row[:path]
    @test_runs.insert_one(row) unless
      @test_runs.find(path: row[:path]).count > 0
  end

  def each
    # @test_runs.find({'synced' => {'$exists' => synced}}).each do |run|
    case @status
    when :all
      collection = @test_runs.find
    when :synced
      collection = @test_runs.find({'synced' => {'$exists' => synced}})
    else
      collection = @test_runs.find
    end
    collection.each do |run|
      yield run
    end
  end

  def synced(run)
    if run[:status] == 'done'
      @test_runs.find(run).update_one('$set' => { synced: true })
    end
  end

  # def set_status(run, status)
  #   @test_runs.find(path: run)
  #     .update_one('$set' => { status: status })
  # end

  def is_synced?(path)
    @test_runs.find(path: path, synced: true).count > 0
  end
end

class HashToJson
  def initialize(filename)
    @filename = filename
    @data = []
  end

  def <<(row)
    @data << row
  end

  def build
    h = {}
    h[:data] = @data
    File.open(@filename, 'w') do |f|
      f.puts JSON.pretty_generate(@data)
    end
  end
end
