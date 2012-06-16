class RemoveOrientationFromDirections < ActiveRecord::Migration
  def up
    remove_column :directions, :orientation
      end

  def down
    add_column :directions, :orientation, :float
  end
end
