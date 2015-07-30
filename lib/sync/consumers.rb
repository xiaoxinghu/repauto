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
    @client[:test_suites].find(path: suite[:path])
      .update_one(suite, upsert: true)
  end

  def each
    @client[:test_suites].find.each do |ts|
      yield ts.to_hash
    end
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
  def <<(test_suite)
    tr_path = test_suite[:path].split('/allure/')[0]
    trs = @client[:test_runs].find(path: tr_path)

    start = test_suite[:start].to_i
    stop = test_suite[:stop].to_i
    tr = trs.first
    if !tr[:start] || tr[:start] > start
      tr[:start] = start
    end
    if !tr[:stop] || tr[:stop] < stop
      tr[:stop] = stop
    end
    @client[:test_runs].find(path: tr_path).update_one(tr)
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
  def initialize
    super
    @test_runs = @client[:test_runs]
  end

  def <<(row)
    # puts row[:path]
    row[:status] = 'in progress'
    @test_runs.insert_one(row) unless
      @test_runs.find(path: row[:path]).count > 0
  end

  def each(status)
    @test_runs.find(status: status).each do |run|
      yield run
    end
  end

  def set_status(run, status)
    @test_runs.find(path: run)
      .update_one('$set' => { status: status })
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
