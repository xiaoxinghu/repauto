module TestCasesHelper
  def history(test_case)
    TestCase.where(name: test_case.name).where.not(id: test_case.id).order("start DESC").limit(10)
  end

  def filter_test_cases(test_cases, status: nil, platform: nil)
    query = test_cases
    query = query.includes(:tags).where(tags: { value: platform }) unless platform.blank?
    query = query.where(status: status) unless status.blank?
    query
  end

  def group_by_status(test_cases, platform: nil, consolidate: 0)
    query = test_cases
    query = query.includes(:tags).where(tags: { value: platform }) if platform
    # count = query.group(:status).count
    count = status_count query
    if consolidate > 1
      filter_test_cases(test_cases, status: 'broken', platform: platform).each do |tc|
        count['broken'] -= 1
        count[tc.consolidated_status] = 0 unless count[tc.consolidated_status]
        count[tc.consolidated_status] += 1
      end
    end
    count
  end

  def filter_by_tags(test_cases, tags)
    test_cases.select { |tc| tc.with_tags? tags }
  end

  def group_by_name(test_cases, tags: nil)
    group = {}
    query = test_cases
    query.each do |tc|
      # get raw scenario name
      catch :wrong_tags do
        if tags
          tags.each do |tag|
            throw :wrong_tags unless tc.tags.any? { |t| 0 == t.value.casecmp(tag) }
          end
        end
        name = stripped_name tc
        group[name] ||= []
        group[name] << tc
      end
    end
    group
  end

  def stripped_name(test_case)
    # tags = test_case.tags.collect(&:value)
    # n = test_case.name.split '_'
    # filtered = n.select do |x|
    #   !tags.any?{ |t| t.casecmp(x) == 0 }
    # end
    # name = filtered.join '_'
    # name
    test_case.name.split('_').first
  end

  def status_count(test_cases)
    return test_cases.group(:status).count if test_cases.respond_to?('group')
    count = {}
    test_cases.each do |tc|
      count[tc.status] = 0 unless count[tc.status]
      count[tc.status] += 1
    end
    count
  end

  def gen_status(test_cases)
    status = {}
    tcs = test_cases if test_cases.is_a? Array
    tcs = test_cases.values.flatten if test_cases.is_a? Hash
    tcs.group_by(&:status).each do |k, v|
      status[k] = v.size
    end
    status
  end

  def status_icon(status)
    case status
    when 'passed'
      'check'
    when 'failed'
      'times'
    when 'broken'
      'bolt'
    when 'canceled'
      'ban'
    else
      'question'
    end
  end

  def get_att_link(test_case, attachment)
    p = Pathname.new APP_CONFIG['mount_point']
    p = p.join test_case[:path]
    p.dirname.join(attachment[:source]).to_s
  end

end
