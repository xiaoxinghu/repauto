class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.string :name
      t.string :value
      t.string :kind
      t.references :test_case, index: true

      t.timestamps null: false
    end
    add_foreign_key :tags, :test_cases
  end
end
