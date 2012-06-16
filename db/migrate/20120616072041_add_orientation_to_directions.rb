class AddOrientationToDirections < ActiveRecord::Migration
  def change
    add_column :directions, :orientation, :integer

  end
end
