require_relative './utilities'

class TestCaseHttp
  include FileCrawler
  def initialize(test_run_path, new_only = true)
    @new_only = new_only
    @test_run_path = test_run_path.to_s
    # puts "scanning #{test_run_path}"
    @suite_files = Pathname
                   .glob("#{root}/#{test_run_path}/allure/*-testsuite.xml")
    # @xml = self.class.get(path)
    @db_suites = TestSuiteMongo.new
  end

  def each
    @suite_files.each do |suite_file|
      path = suite_file.relative_path_from(Pathname.new(root)).to_s
      if @new_only && @db_suites.exists?(path)
        # puts "#{path} already done"
        next
      end
      File.open(suite_file) do |f|
        content = Nokogiri::XML f
        begin
          test_suites = content.xpath('xmlns:test-suite')
        rescue Nokogiri::XML::XPath::SyntaxError
          break
        end
        test_suites.each do |ts|
          test_suite = {
            name: ts.xpath('name').first.content,
            path: path,
            start: ts['start'].to_i,
            stop: ts['stop'].to_i
          }
          ts.xpath('test-cases/test-case').each do |tc|
            test_case = {
              name: tc.xpath('name').first.content,
              path: path,
              start: tc['start'].to_i,
              stop: tc['stop'].to_i,
              status: tc['status'],
              test_suite: test_suite
            }

            # sync steps
            steps = tc.xpath('steps/step')
            if steps
              test_case[:steps] = []
              steps.each do |s|
                step = {
                  name: s.xpath('name').first.content,
                  start: s['start'].to_i,
                  stop: s['stop'].to_i,
                  status: s['status']
                }
                test_case[:steps] << step
              end
            end

            # sync failure
            f = tc.xpath('failure').first
            if f
              failure = {}
              m = f.xpath('message').first
              t = f.xpath('stack-trace').first
              failure[:message] = m.content if m
              failure[:stack_trace] = t.content if t
              test_case[:failure] = failure
            end

            # sync attachments
            atts = []
            tc.xpath('attachments/attachment').each_with_index do |a, i|
              atts << {
                title: a['title'],
                type: a['type'],
                source: a['source']
              }
            end
            test_case[:attachments] = atts

            # sync tags
            tags = []
            tc.xpath('parameters/parameter').each do |t|
              tags << t['value']
            end
            test_case[:tags] = tags
            yield test_case
          end
        end
      end
    end
  end
end

class TestRunsHttp
  include FileCrawler
  def initialize(project_path)
    @project_path = project_path.to_s
    # puts "scanning project: #{project_path}"
    @folders = Pathname.glob("#{root}/#{project_path}/*").select(&:directory?)
    @mongo = TestRunsMongo.new
  end

  def each
    @folders.each do |folder|
      Pathname.glob("#{folder}/*").each do |run|
        # ignore non folder path
        next unless run.directory?
        path = run.relative_path_from(Pathname.new(root)).to_s
        type = run.parent.basename.to_s
        # ignore synced ones
        next if @mongo.is_synced? path
        # ignore results without allure folder
        next unless Pathname.new("#{run}/allure").exist?

        status_file = Pathname.new("#{run}/status.yml")
        in_progress_file = Pathname.new("#{run}/in_progress")
        # new status.yml file support
        r = { path: path,
              project_path: @project_path,
              type: type}
        begin
          r[:start] = Time.strptime(run.basename.to_s, '%Y-%m-%d-%H-%M-%S').to_i * 1000
        rescue StandardError => e
          puts "ignore bad folder #{run.basename}."
          next
        end
        if status_file.exist?
          status = YAML.load_file(status_file)
          next unless status
          puts "status file: #{status_file}"
          r[:start] = status['start_time']
          r[:status] = status['status']
          r[:stop] = status['end_time'] if status['end_time']
        elsif in_progress_file.exist?
          r[:status] = 'running'
        else
          r[:status] = 'done'
        end
        yield r
      end
    end
  end
end


class ProjectsHttp
  include FileCrawler
  def each
    projects = Pathname.glob("#{root}/*/project.yml")
    projects.each do |f|
      p = YAML.load_file(f)
      p[:path] = f.relative_path_from(Pathname.new(root)).dirname.to_s
      yield p
    end
  end
end
