class ChangeColumnSize < ActiveRecord::Migration
  def change
    change_column :steps, :name, :text
  end
end
