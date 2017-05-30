class CreateTasks < ActiveRecord::Migration[5.0]
  def change
    create_table :tasks do |t|
      t.string "task_name", :limit => 50
      t.integer "user_id"
      t.integer "project_id"
      t.integer "due_month"
      t.integer "due_day"
      t.integer "due_year"
      t.integer "start_time"
      t.integer "start_month"
      t.integer "start_day"
      t.integer "start_year"
      t.integer "end_month"
      t.integer "end_day"
      t.integer "end_year"
      t.boolean "completed", :default => false
      t.text "note"
    end
  end
end
