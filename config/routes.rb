Rails.application.routes.draw do
  apipie
  # restful api
  namespace :api, defaults: { format: :json } do
    resources :projects, only: [:show, :index, :create, :update] do
      member do
        get 'trend'
        get 'summary'
      end

      resources :test_runs, shallow: true, only: [:show, :index, :create, :update] do
        member do
          put 'archive'
          put 'restore'
          put 'stop'
        end

        resources :test_cases, shallow: true, only: [:index, :show, :create] do
          member do
            get :history
            post :comment
          end
        end
      end
    end

    get 'test_runs/diff/:id1/:id2' => 'test_runs#diff'

    resources :attachments, only: [:create, :show] do
      member do
        get 'raw'
      end
    end

    get 'system/info' => 'system#info'
  end

  root 'welcome#index'

  match '*all', to: 'welcome#index', via: [:get]
end
