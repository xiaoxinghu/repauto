require 'digest'

module AllureHelper
  module TestCaseHelper
    def parse(project, hash)
      name = hash['name']
      steps = []
      if hash.key? 'steps'
        ss = hash['steps']['step']
        ss = [ss] if ss.is_a? Hash
        steps = ss.map do |s|
          s['name']
        end
      end
      md5 = get_md5(project, name, steps)
      tc = TestCase.where(md5: md5).first
      return tc if tc
      tc = TestCase.new(
        name: name,
        steps: steps,
        md5: md5
      )
      tc.project = project
      tc.save!
      tc
    end

    private

    def get_md5(project, name, steps)
      md5 = Digest::MD5.new
      md5 << project.path
      md5 << name
      steps.each do |step|
        md5 << step
      end
      md5.hexdigest
    end
  end
end
