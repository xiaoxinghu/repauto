class CreateTestCases < ActiveRecord::Migration
  def change
    create_table :test_cases do |t|
      t.string :name
      t.datetime :start
      t.datetime :end
      t.string :status
      t.references :test_suite, index: true

      t.timestamps null: false
    end
    add_foreign_key :test_cases, :test_suites
  end
end
