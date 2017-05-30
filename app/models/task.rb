class Task < ApplicationRecord
  validates_presence_of :task_name
  validates_presence_of :user_id

end
