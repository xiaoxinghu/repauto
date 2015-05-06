module Filter

  def filter(test_runs, name, number)
    @sample_amount = 10
    @min_proportion = 0.5

    trs = test_runs
          .where.not(start: nil)
          .where.not(end: nil)
          .where(in_progress: false)
          .where(name: name)
          .order('start DESC')

    sample = trs.first(@sample_amount)

    max_run = sample.max_by { |r| r.test_cases.count }.test_cases.count

    chosen = trs.select{ |r| r.test_cases.count > max_run * @min_proportion }
    chosen.first(number)
  end
end
