# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120616072204) do

  create_table "directions", :force => true do |t|
    t.integer  "from_id"
    t.integer  "to_id"
    t.integer  "next_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
    t.float    "distance"
    t.integer  "orientation"
  end

  create_table "lines", :force => true do |t|
    t.integer  "start_id"
    t.integer  "end_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
    t.integer  "map_id"
    t.float    "cost"
    t.integer  "orientation"
  end

  create_table "maps", :force => true do |t|
    t.string   "name"
    t.float    "height"
    t.float    "width"
    t.string   "path"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "marks", :force => true do |t|
    t.integer  "code"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "nodes", :force => true do |t|
    t.string   "name"
    t.float    "x"
    t.float    "y"
    t.integer  "mark_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "map_id"
  end

end
