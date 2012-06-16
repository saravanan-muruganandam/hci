class AddDistanceToDirections < ActiveRecord::Migration
  def change
    add_column :directions, :distance, :float

  end
end
