class AddInProgressToTestRuns < ActiveRecord::Migration
  def change
    add_column :test_runs, :in_progress, :boolean, default: false
  end
end
