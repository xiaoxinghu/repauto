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
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150301231759) do

  create_table "attachments", force: :cascade do |t|
    t.string   "title"
    t.string   "source"
    t.string   "kind"
    t.integer  "position"
    t.integer  "test_case_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "attachments", ["test_case_id"], name: "index_attachments_on_test_case_id"

  create_table "failures", force: :cascade do |t|
    t.text     "message"
    t.text     "stack_trace"
    t.integer  "test_case_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "failures", ["test_case_id"], name: "index_failures_on_test_case_id"

  create_table "projects", force: :cascade do |t|
    t.string   "stream"
    t.string   "name"
    t.string   "path"
    t.string   "desc"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "steps", force: :cascade do |t|
    t.datetime "start"
    t.datetime "end"
    t.string   "status"
    t.string   "name"
    t.integer  "test_case_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "steps", ["test_case_id"], name: "index_steps_on_test_case_id"

  create_table "tags", force: :cascade do |t|
    t.string   "name"
    t.string   "value"
    t.string   "kind"
    t.integer  "test_case_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "tags", ["test_case_id"], name: "index_tags_on_test_case_id"

  create_table "test_cases", force: :cascade do |t|
    t.string   "name"
    t.datetime "start"
    t.datetime "end"
    t.string   "status"
    t.integer  "test_suite_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "test_cases", ["test_suite_id"], name: "index_test_cases_on_test_suite_id"

  create_table "test_runs", force: :cascade do |t|
    t.string   "name"
    t.datetime "start"
    t.datetime "end"
    t.string   "path"
    t.integer  "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "test_runs", ["project_id"], name: "index_test_runs_on_project_id"

  create_table "test_suites", force: :cascade do |t|
    t.string   "name"
    t.datetime "start"
    t.datetime "end"
    t.string   "path"
    t.integer  "test_run_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "test_suites", ["test_run_id"], name: "index_test_suites_on_test_run_id"

end
