class CreateDirections < ActiveRecord::Migration
  def change
    create_table :directions do |t|
      t.integer :from_id
      t.integer :to_id
      t.integer :next_id

      t.timestamps
    end
  end
end
