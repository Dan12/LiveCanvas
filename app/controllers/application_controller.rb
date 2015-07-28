class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  $searchSuccess = false
  
  helper_method :setSuccess
  helper_method :getSuccess
  
  def setSuccess(s)
    searchSuccess = s
  end
  
  def getSuccess
    return searchSuccess
  end
  
  def index
    render 'index'
  end
  
  def processpng
    #require 'base64'
    
    data = params['png']
    #remove all extras except data
    image_data = Base64.decode64(data['data:image/png;base64,'.length .. -1])

    File.open("#{Rails.root}/app/assets/images/canvasImg.png", 'wb') do |f|
      f.write image_data
    end
    Thread.new do
      $searchSuccess = false
      puts "Getting search output"
      output = `node /home/nitrous/code/Desktop/Rails_Apps/livecanvas/app/assets/javascripts/nodeJS/search.js`
      puts "Got search output"
      if(output.split("\n")[0] != "none")
        outSplit = output.split("\n");
        for i in 0..2
          image_data = Base64.decode64(outSplit[i])
          File.open("#{Rails.root}/app/assets/images/imgSearch#{i}.png", 'wb') do |f|
            f.write image_data
          end
        end
        puts "Search was a success"
        #puts output
        $searchSuccess = true
      else
        File.open("#{Rails.root}/public/temp/index.html", 'wb') do |f|
          f.write output[4..-1]
        end
        puts "Search was a failure"
      end
    end
    #render :json => {"canvasImg" => ActionController::Base.helpers.asset_path('canvasImg.png'), "imgSearch" => ActionController::Base.helpers.asset_path('imgSearch.png')}
    render 'index'
    #redirect_to :back
  end
  
  def returnpngs
    render :json => {"canvasImg" => ActionController::Base.helpers.asset_path('canvasImg.png'), "imgSearch0" => ActionController::Base.helpers.asset_path('imgSearch0.png'), "imgSearch1" => ActionController::Base.helpers.asset_path('imgSearch1.png'), "imgSearch2" => ActionController::Base.helpers.asset_path('imgSearch2.png'), "searchSuccess" => $searchSuccess}
  end
end
