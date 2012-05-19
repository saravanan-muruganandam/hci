class CreateMaps < ActiveRecord::Migration
  def change
    create_table :maps do |t|
      t.string :name
      t.float :height
      t.float :width
      t.string :path

      t.timestamps
    end
  end
end
