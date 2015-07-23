Rails.application.routes.draw do
  root 'application#index'
  
  post '/sendPNG' => 'application#processpng', :via => :post
end
