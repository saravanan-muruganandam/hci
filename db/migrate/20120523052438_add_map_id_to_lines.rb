class AddMapIdToLines < ActiveRecord::Migration
  def change
    add_column :lines, :map_id, :integer

  end
end
