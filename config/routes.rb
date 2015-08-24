Rails.application.routes.draw do

  resources :projects, only: [:index, :show] do
    # collection do
    #   post :sync
    # end
    member do
      get 'trend', to: 'projects#trend', as: 'trend'
      get 'fetch_trend'
      get 'fetch_history'
    end
    resources :test_runs, only: [:index, :show], shallow: true do
      member do
        # get 'errors'
        get 'fetch_tree'
        get 'timeline'
        get 'archive'
        get 'restore'
        get 'ra'
      end
      collection do
        # get 'trend/:run_type', to: 'test_runs#trend', as: 'trend'
        get 'bin'
        get 'diff'
      end
      resources :test_suites, only: [:index, :show], shallow: true do
        resources :test_cases, only: [:index, :show], shallow: true do
          member do
            get 'fetch_history'
            # get 'diff/:target_id', to: 'test_cases#diff', as: 'diff'
            get 'fetch'
          end
          # collection do
          #   post 'diff', to: 'test_cases#diff', as: 'diff'
          # end
        end
      end
    end
  end

  get 'fetch_test_cases/:ids', to: 'test_cases#fetch', as: :fetch_test_cases

  # ajax endpoints

  get 'welcome/index'

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
end
