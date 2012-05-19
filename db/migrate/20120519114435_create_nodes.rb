class CreateNodes < ActiveRecord::Migration
  def change
    create_table :nodes do |t|
      t.string :name
      t.float :x
      t.float :y
      t.integer :mark_id

      t.timestamps
    end
  end
end
