class CreateMarks < ActiveRecord::Migration
  def change
    create_table :marks do |t|
      t.integer :code

      t.timestamps
    end
  end
end
