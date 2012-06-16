class AddOrientationToLines < ActiveRecord::Migration
  def change
    add_column :lines, :orientation, :integer

  end
end
