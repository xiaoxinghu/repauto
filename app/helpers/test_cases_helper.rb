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

  def group_by_name(test_cases, platform: nil)
    group = {}
    query = test_cases
    query = query.includes(:tags).where(tags: { value: platform }) if platform
    query.each do |tc|
      # get raw scenario name
      name = tc.name.split('_').first
      group[name] ||= []
      group[name] << tc
    end
    group
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
end
