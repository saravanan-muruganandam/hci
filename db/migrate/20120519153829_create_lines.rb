class CreateLines < ActiveRecord::Migration
  def change
    create_table :lines do |t|
      t.integer :start_id
      t.integer :end_id

      t.timestamps
    end

    add_index :lines, :start_id
    add_index :lines, :end_id
    add_index :relationships, [:start_id, :end_id], unique: true
  end
end
