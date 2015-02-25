class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :stream
      t.string :name
      t.string :path
      t.string :desc

      t.timestamps null: false
    end
  end
end
