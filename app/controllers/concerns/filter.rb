module Filter

  def filter(test_runs, name, number)
    @plot_amount =  30
    @sample_amount = 10
    @max_run = 0
    @min_proportion = 0.5

    trs = test_runs
          .where.not(start: nil)
          .where.not(end: nil)
          .where(name: name)
          .order('start DESC')

    sample = trs.first(@sample_amount)

    @max_run = sample.max_by { |r| r.count }.count

    chosen = trs.select{ |r| r.count > @max_run * @min_proportion }
    chosen.first(number)
  end
end
