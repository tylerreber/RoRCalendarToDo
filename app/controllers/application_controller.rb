class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def confirm_logged_in
    unless session[:user_id]
      flash[:notice] = "Please log in"
      redirect_to(access_login_path)
    end
  end

  private

  def current_user
    @current_user ||= session[:user_id]
  end
  helper_method :current_user
end
