class WelcomeController < ApplicationController
  def index
    if params[:refresh]
      Rails.cache.clear
    end
  end
end
