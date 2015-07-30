require_relative './utilities'

class TestCaseHttp
  include FileCrawler
  def initialize(test_run_path)
    @test_run_path = test_run_path.to_s
    puts "scanning #{test_run_path}"
    @suite_files = Pathname
                   .glob("#{root}/#{test_run_path}/allure/*-testsuite.xml")
    # @xml = self.class.get(path)
  end

  def each
    @suite_files.each do |suite_file|
      File.open(suite_file) do |f|
        path = suite_file.relative_path_from(Pathname.new(root)).to_s
        content = Nokogiri::XML f
        content.xpath('xmlns:test-suite').each do |ts|
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
    puts "scanning project: #{project_path}"
    @folders = Pathname.glob("#{root}/#{project_path}/*").select(&:directory?)
  end

  def each
    @folders.each do |folder|
      puts folder
      Pathname.glob("#{folder}/*").each do |run|
        next unless run.directory?
        time = run.basename.to_s
        type = run.parent.basename.to_s
        path = run.relative_path_from(Pathname.new(root)).to_s
        begin
          timestamp = Time.strptime(time, '%Y-%m-%d-%H-%M-%S')
          r = { path: path,
                project_path: @project_path,
                type: type }
          yield r
        rescue
          puts "Ignoring invalid folder name: #{time}"
          next
        end
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
