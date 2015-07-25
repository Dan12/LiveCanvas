class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  def index
    render 'index'
  end
  
  def processpng
    require 'base64'
    
    data = params['png']
    #remove all extras except data
    image_data = Base64.decode64(data['data:image/png;base64,'.length .. -1])

    File.open("#{Rails.root}/app/assets/images/canvasImg.png", 'wb') do |f|
      f.write image_data
    end
    Thread.new do
      output = `node /home/nitrous/code/Desktop/Rails_Apps/livecanvas/app/assets/javascripts/nodeJS/search.js`
      if(output.split("\n")[0] != "none")
        image_data = Base64.decode64(output)
        File.open("#{Rails.root}/app/assets/images/imgSearch.png", 'wb') do |f|
          f.write image_data
        end
        puts ""
        puts output
      else
        File.open("#{Rails.root}/public/temp/index.html", 'wb') do |f|
          f.write output[4..-1]
        end
      end
    end
    render 'index'
    #redirect_to :back
  end
end
