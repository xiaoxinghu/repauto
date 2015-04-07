class CreateFailures < ActiveRecord::Migration
  def change
    create_table :failures do |t|
      t.text :message
      t.text :stack_trace
      t.references :test_case, index: true

      t.timestamps null: false
    end
    add_foreign_key :failures, :test_cases
  end
end
