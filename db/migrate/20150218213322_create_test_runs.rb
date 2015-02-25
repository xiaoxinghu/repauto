class CreateTestRuns < ActiveRecord::Migration
  def change
    create_table :test_runs do |t|
      t.string :name
      t.datetime :start
      t.datetime :end
      t.string :path
      t.references :project, index: true

      t.timestamps null: false
    end
    add_foreign_key :test_runs, :projects
  end
end
