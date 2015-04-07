class CreateAttachments < ActiveRecord::Migration
  def change
    create_table :attachments do |t|
      t.string :title
      t.string :source
      t.string :kind
      t.integer :position
      t.references :test_case, index: true

      t.timestamps null: false
    end
    add_foreign_key :attachments, :test_cases
  end
end
