module TestCasesHelper
  def history(test_case)
    TestCase.where(name: test_case.name).where.not(id: test_case.id).order("start DESC").limit(10)
  end

end
