class AddRemovedAtToTestRuns < ActiveRecord::Migration
  def change
    add_column :test_runs, :removed_at, :datetime
  end
end
