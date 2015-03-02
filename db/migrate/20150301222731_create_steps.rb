class CreateSteps < ActiveRecord::Migration
  def change
    create_table :steps do |t|
      t.datetime :start
      t.datetime :end
      t.string :status
      t.string :name
      t.references :test_case, index: true

      t.timestamps null: false
    end
    add_foreign_key :steps, :test_cases
  end
end
