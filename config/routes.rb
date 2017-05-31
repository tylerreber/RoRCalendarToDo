Rails.application.routes.draw do
  root :to => 'access#login'
  get 'access/menu'

  get 'access/login'
  post 'access/attempt_login'
  get 'access/logout'



  get 'month/index'
  get 'month/list'
  post 'month/update'
  post 'month/new'
  get 'month/week'

  resources :month do
    member do
      get :delete
    end
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
