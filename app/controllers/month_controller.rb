class MonthController < ApplicationController
  before_action :confirm_logged_in
  before_action :current_user

  layout 'application'
  protect_from_forgery :except => :update

  def index
    @month = params[:month]
  end
  def list
    @tasks = Task.where(:completed => 0, :user_id => session[:user_id])
    send_data @tasks.to_json
  end

  def update
    @task = Task.find(params[:id])
    @task.update_attributes(task_params)
    if params[:completed] == "1"
      @task.completed = true
    else
      @task.completed = false
    end
    @task.save
    @tasks = Task.where(:completed => 0)
    send_data @tasks.to_json
  end

  def new
    @user_id = session[:user_id]
    @task = Task.new
    @task.task_name = ActionController::Base.helpers.sanitize(params[:task_name])
    @task.user_id = @current_user
    @task.save
    send_data @task.to_json
  end

  private

  def task_params
    params.permit(
      :task_name,
      :end_time,
      :id,
      :start_time,
      :due_month,
      :due_day,
      :due_year,
      :note,
      :user_id
    )
  end
end
