class CreateProjects < ActiveRecord::Migration[5.0]
  def change
    create_table :projects do |t|
      t.string "project_name", :limit => 50
      t.integer "user_id"
    end
    add_index("projects", "user_id")
  end
end
