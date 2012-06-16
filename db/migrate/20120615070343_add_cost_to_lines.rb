class AddCostToLines < ActiveRecord::Migration
  def change
    add_column :lines, :cost, :float

  end
end
