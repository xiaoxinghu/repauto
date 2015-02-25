class CreateTestSuites < ActiveRecord::Migration
  def change
    create_table :test_suites do |t|
      t.string :name
      t.datetime :start
      t.datetime :end
      t.string :path
      t.references :test_run, index: true

      t.timestamps null: false
    end
    add_foreign_key :test_suites, :test_runs
  end
end
