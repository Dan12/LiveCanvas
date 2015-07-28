$(".canvas").ready(function(){
  
  console.log("Starting app");
  
  var c = document.getElementById("myCanvas");
  var canvas = c.getContext("2d");
  var tempElem = document.getElementById("tempCanvas");

  var d = new Date();
  
  var imgPath = $(".data").data("pathToAsset");
  var searchPaths = [];
  for(var i = 0; i < 3; i++)
    searchPaths[i] = $(".data").data("pathToAsset"+(i+2));
  
  var drawImage = true;
  //console.log(imgPath+"\n"+img2Path);
  
  var img = new Image();
  img.src = imgPath;
  var imgCanvas = new Image();
  imgCanvas.src = imgPath;
  var imgSearch = [];
  for(var i = 0; i < 3; i++){
    imgSearch[i] = new Image();
    imgSearch[i].src = searchPaths[i];
  }
  
  $('.canvasImg').attr("src", imgCanvas.src);
  for(var i in imgSearch)
    $('.searchImg'+i).attr("src", imgSearch[i].src);
 
  img.onload = function () {
    canvas.drawImage(img,0,0);
  }

  var clicks = new Array();
  var clickDrag = new Array();
  var paint = false;
  var rgb = [223,75,38];
  
  $('.rInput').val(rgb[0]);
  $('.gInput').val(rgb[1]);
  $('.bInput').val(rgb[2]);

  function addClick(x, y, dragging){
    clicks.push({"x":x,"y":y,"r":rgb[0],"g":rgb[1],"b":rgb[2]});
    clickDrag.push(dragging);
  }
  
  function redraw(){
    canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height); // Clears the canvas

    if(drawImage)
      canvas.drawImage(img,0,0);
    
    setRGB();
    canvas.lineJoin = "round";
    canvas.lineWidth = 5;
			
    for(var i=0; i < clicks.length; i++) {	
      canvas.strokeStyle = "rgb("+clicks[i].r+","+clicks[i].g+","+clicks[i].b+")";
      canvas.beginPath();
      if(clickDrag[i] && i){
        canvas.moveTo(clicks[i-1].x,clicks[i-1].y);
      }
      else{
        canvas.moveTo(clicks[i].x-1, clicks[i].y);
      }
      canvas.lineTo(clicks[i].x, clicks[i].y);
      canvas.closePath();
      canvas.stroke();
    }
  }
  
  function setRGB(){
    rgb[0] = parseInt($('.rInput').val());
    rgb[1] = parseInt($('.gInput').val());
    rgb[2] = parseInt($('.bInput').val());
  }
  
  function getOtherImage(){
    $.ajax({
        type: "POST",
        url: "/getPNGS",
        data: {},
        success: function(data, textStatus, jqXHR) {
          //console.log("Data: "+data);
          //console.log(textStatus);
          console.log(jqXHR);
          imgCanvas.src = jqXHR.responseJSON.canvasImg;
          imgSearch[0].src = jqXHR.responseJSON.imgSearch0;
          imgSearch[1].src = jqXHR.responseJSON.imgSearch1;
          imgSearch[2].src = jqXHR.responseJSON.imgSearch2;
          imgSearch[0].onload = function(){
            console.log("Got Here 1");
            combineImages();
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error=" + errorThrown);
        }
    });
  }
  
  function combineImages(){
    paint = false;
    async(function(){
      combImgs(imgCanvas,imgSearch[0],c,tempElem);
    },function(){
      async(function(){
        combImgs(imgCanvas,imgSearch[1],c,tempElem);
      },function(){
        async(function(){
          combImgs(imgCanvas,imgSearch[2],c,tempElem);
        },function(){
          img.src = c.toDataURL('image/png');
        });
      });      
    });
//      combImgs(imgCanvas,imgSearch[0],c,tempElem);
//     imgCanvas.src = c.toDataURL('image/png');
//     combImgs(imgCanvas.src,imgSearch[1].src,c,tempElem);
//     imgCanvas.src = c.toDataURL('image/png');
//     combImgs(imgCanvas.src,imgSearch[2].src,c,tempElem);
//     imgCanvas.src = c.toDataURL('image/png');
//     img.src = c.toDataURL('image/png');
  };
  
  function async(your_function, callback) {
    your_function();
    setTimeout(function() {
        callback();
    }, 1);
  };
  
  $('.combine_button').click(function(){
    combineImages();
  });
  
  function imageTimeout(){
    setTimeout(function(){
      getOtherImage();
      reloadImgs();
    },20000);
  };
  
  function reloadImgs(){
    $('.canvasImg').attr("src","http://jimpunk.net/Loading/wp-content/uploads/loading18.gif");
    for(var i in imgSearch)
      $('.searchImg'+i).attr("src", "http://jimpunk.net/Loading/wp-content/uploads/loading18.gif");
    setTimeout(function(){
      $('.canvasImg').attr("src", imgCanvas.src);
      for(var i in imgSearch)
        $('.searchImg'+i).attr("src", imgSearch[i].src);
    },1000);
  }
  
  $('.clear_button').click(function(){
    canvas.clear;
    var clicks = new Array();
    var clickDrag = new Array();
    drawImage = false;
    redraw();
  });
  
  $('.send_button').click(function(){
    var dataURL = c.toDataURL('image/png');
    $.ajax({
        type: "POST",
        url: "/sendPNG",
        data: {png: dataURL},
        success: function(data, textStatus, jqXHR) {
          //console.log("Data: "+data);
          //console.log(textStatus);
          console.log(jqXHR);
          imageTimeout();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error=" + errorThrown);
        }
    });
    //$('.gotImg img').attr("src","http://ruby-on-rails-114302.nitrousapp.com:3000/assets/canvasImg.png");
  });
  
   $('.reload_button').click(function(){
      reloadImgs();
    });
    
  $('#myCanvas').mousedown(function(e){

    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
  });
  
  $('#myCanvas').mousemove(function(e){
    if(paint){
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
      redraw();
    }
  });
  
  $('#myCanvas').mouseup(function(e){
    paint = false;
  });
  
  $('#myCanvas').mouseleave(function(e){
    paint = false;
  });
});