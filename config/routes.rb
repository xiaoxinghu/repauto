Rails.application.routes.draw do
  # restful api
  namespace :api, defaults: { format: :json } do
    resources :projects, only: [:show, :index] do
      member do
        get 'run_names'
        get 'trend'
      end
    end
    resources :attachments, only: [:show] do
      member do
        get 'raw'
      end
    end
    resources :test_runs, only: [:show, :index] do
      member do
        get 'progress'
        get 'detail'
        get 'archive'
        get 'restore'
      end
      collection do
        get 'diff'
      end
    end
    resources :test_cases, only: [:show] do
      member do
        get :history
        post :comment
      end
    end
  end

  # views
  # resources :projects, only: [:index, :show] do
  #   member do
  #     get 'trend', to: 'projects#trend', as: 'trend'
  #   end
  #   resources :test_runs, only: [:index, :show], shallow: true do
  #     collection do
  #       get 'bin'
  #       get 'diff'
  #     end
  #   end
  # end


  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  match '*all', to: 'welcome#index', via: [:get]
end
