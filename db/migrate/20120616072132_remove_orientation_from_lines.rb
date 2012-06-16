class RemoveOrientationFromLines < ActiveRecord::Migration
  def up
    remove_column :lines, :orientation
      end

  def down
    add_column :lines, :orientation, :float
  end
end
