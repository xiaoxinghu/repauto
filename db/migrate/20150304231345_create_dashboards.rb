class CreateDashboards < ActiveRecord::Migration
  def change
    create_table :dashboards do |t|
      t.string :name
      t.string :link
      t.string :desc
      t.references :project, index: true

      t.timestamps null: false
    end
    add_foreign_key :dashboards, :projects
  end
end
