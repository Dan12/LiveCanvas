class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  def index
    render 'index'
  end
  
  def processpng
    puts "========="
    puts "reading data"
    require 'base64'
    
    data = params['png']
    #remove all extras except data
    image_data = Base64.decode64(data['data:image/png;base64,'.length .. -1])

    File.open("#{Rails.root}/public/pngs/canvasImg.png", 'wb') do |f|
      f.write image_data
    end
  end
end
