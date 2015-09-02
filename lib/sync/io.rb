# for finding project setting files
class YamlFiles
  def initialize(pattern)
    @pattern = pattern
  end

  def each
    projects = Pathname.glob(@pattern)
    projects.each do |f|
      p = YAML.load_file(f)
      p[:path] = f.to_s
      yield p
    end
  end
end

class Folders
  def initialize(pattern)
    @folders = Pathname.glob(pattern).select(&:directory?)
  end

  def each
    @folders.each do |folder|
      yield folder
    end
  end
end

class ProjectsInDB
  def initialize
    @projects = MONGO_CLIENT[:projects]
  end

  def each
    @projects.find.each do |p|
      yield p.to_hash
    end
  end

  def <<(row)
    row[:last_sync] = Time.now.to_i * 1000
    @projects.find(path: row[:path]).replace_one(row, upsert: true)
  end
end

class TestRunsInDB
  def initialize(status = :all)
    @status = status
    @test_runs = MONGO_CLIENT[:test_runs]
    @total = 0
  end

  def <<(row)
    @total += 1
    if @test_runs.find(path: row[:path]).count > 0
      @test_runs.find(path: row[:path]).find_one_and_update('$set' => {status: row[:status]})
    else
      @test_runs.insert_one(row)
    end
  end

  def each
    # @test_runs.find({'synced' => {'$exists' => synced}}).each do |run|
    case @status
    when :all
      collection = @test_runs.find
    when :unsynced
      collection = @test_runs.find({'synced' => {'$exists' => false}})
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

  def build
    puts "--> #{@total} recived by TestRunsInDB"
  end

  # def set_status(run, status)
  #   @test_runs.find(path: run)
  #     .update_one('$set' => { status: status })
  # end

  def is_synced?(path)
    @test_runs.find(path: path, synced: true).count > 0
  end
end

class TestCasesInDB
  def initialize
    @test_cases = MONGO_CLIENT[:test_cases]
    @bulk_op = []
    @lock = Mutex.new
  end

  def <<(row)
    tcr = row.clone
    tcr.delete :test_suite
    # @bulk_op << {
    #   replace_one: {
    #     find: { path: row[:path], start: row[:start] },
    #     replacement: tcr,
    #     upsert: true
    #   }
    # }
    return if @test_cases.find(path: tcr[:path], start: tcr[:start]).count > 0
    @bulk_op << {
      insert_one: tcr
    }
    dump
  end

  def dump(force: false)
    bulk_op = []
    @lock.synchronize do
      return if @bulk_op.size == 0
      return unless @bulk_op.size >= 20_000 || force
      bulk_op = @bulk_op.clone
      @bulk_op.clear
    end
    @test_cases.bulk_write(bulk_op, ordered: false)
  end

  def build
    dump force: true
  end
end

class TestSuiteInDB
  def initialize
    @test_suites = MONGO_CLIENT[:test_suites]
  end

  def <<(row)
    tcr = row.clone
    suite = tcr.delete :test_suite

    return if @test_suites.find(path: suite[:path]).count > 0
    @test_suites.insert_one(suite)
  end

  def each
    @test_suites.find.each do |ts|
      yield ts.to_hash
    end
  end

  def exists?(path)
    @test_suites.find(path: path).count > 0
  end
end

class UpdateTestRunSummary
  def initialize
    @test_runs = MONGO_CLIENT[:test_runs]
    @bulk_op = []
    @updated = Set.new
  end

  def <<(row)
    tr_path = row[:path].split('/allure/')[0]
    @updated << tr_path

    # @bulk_op << {
    #   update_one: {
    #     find: { path: tr_path },
    #     update: { '$inc' => { "summary.#{row[:status]}": 1 } }
    #   }
    # }
  end

  def build
    @updated.each do |path|
      pipline = [
        { '$match': { path: /^#{path}/ } },
        { '$group': { '_id': '$status', count: { '$sum' => 1 } } }
      ]
      counts = TestCase.collection.aggregate(pipline)
      summary = {}
      counts.each do |c|
        summary[c[:_id]] = c[:count]
      end
      @test_runs.find(path: path).update_one('$set' => {summary: summary})
    end
    # @test_runs.bulk_write(@bulk_op, ordered: true)
  end
end

class UpdateTestRunTime
  def initialize
    @counter = 0
  end
  def <<(test_run)
    suites = MONGO_CLIENT[:test_suites].find(path: /^#{test_run[:path]}/).to_a
    suites.each do |suite|
      start = suite[:start].to_i
      stop = suite[:stop].to_i
      # test_run[:start] = start if !test_run[:start] || test_run[:start] > start
      test_run[:stop] = stop if !test_run[:stop] || test_run[:stop] < stop
    end
    MONGO_CLIENT[:test_runs].find(path: test_run[:path]).update_one(test_run)
    @counter += 1
  end
end

class DoingNothing
  def initialize
    @total = 0
  end
  def <<(row)
    # puts row
    @total += 1
  end

  def build
    puts "#{@total} has been recived."
  end
end
