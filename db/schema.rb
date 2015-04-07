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

ActiveRecord::Schema.define(version: 20150304231345) do

  create_table "attachments", force: :cascade do |t|
    t.string   "title",        limit: 255
    t.string   "source",       limit: 255
    t.string   "kind",         limit: 255
    t.integer  "position",     limit: 4
    t.integer  "test_case_id", limit: 4
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "attachments", ["test_case_id"], name: "index_attachments_on_test_case_id", using: :btree

  create_table "dashboards", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.string   "link",       limit: 255
    t.string   "desc",       limit: 255
    t.integer  "project_id", limit: 4
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "dashboards", ["project_id"], name: "index_dashboards_on_project_id", using: :btree

  create_table "failures", force: :cascade do |t|
    t.text     "message",      limit: 65535
    t.text     "stack_trace",  limit: 65535
    t.integer  "test_case_id", limit: 4
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  add_index "failures", ["test_case_id"], name: "index_failures_on_test_case_id", using: :btree

  create_table "projects", force: :cascade do |t|
    t.string   "stream",     limit: 255
    t.string   "name",       limit: 255
    t.string   "path",       limit: 255
    t.string   "desc",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "steps", force: :cascade do |t|
    t.datetime "start"
    t.datetime "end"
    t.string   "status",       limit: 255
    t.string   "name",         limit: 255
    t.integer  "test_case_id", limit: 4
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "steps", ["test_case_id"], name: "index_steps_on_test_case_id", using: :btree

  create_table "tags", force: :cascade do |t|
    t.string   "name",         limit: 255
    t.string   "value",        limit: 255
    t.string   "kind",         limit: 255
    t.integer  "test_case_id", limit: 4
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "tags", ["test_case_id"], name: "index_tags_on_test_case_id", using: :btree

  create_table "test_cases", force: :cascade do |t|
    t.string   "name",          limit: 255
    t.datetime "start"
    t.datetime "end"
    t.string   "status",        limit: 255
    t.integer  "test_suite_id", limit: 4
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "test_cases", ["test_suite_id"], name: "index_test_cases_on_test_suite_id", using: :btree

  create_table "test_runs", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "start"
    t.datetime "end"
    t.string   "path",       limit: 255
    t.integer  "project_id", limit: 4
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "test_runs", ["project_id"], name: "index_test_runs_on_project_id", using: :btree

  create_table "test_suites", force: :cascade do |t|
    t.string   "name",        limit: 255
    t.datetime "start"
    t.datetime "end"
    t.string   "path",        limit: 255
    t.integer  "test_run_id", limit: 4
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  add_index "test_suites", ["test_run_id"], name: "index_test_suites_on_test_run_id", using: :btree

  add_foreign_key "dashboards", "projects"
end
