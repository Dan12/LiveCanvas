$(".canvas").ready(function(){
  
  console.log("Starting app");
  
  var c = document.getElementById("myCanvas");
  var canvas = c.getContext("2d");
  
  canvas.fillStyle = "Green";
  canvas.font = 15+"px Arial";
  canvas.fillText("Draw Some Stuff", 20,20);

  var clicks = new Array();
  var clickDrag = new Array();
  var paint;
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
  
  $('.button').click(function(){
    var dataURL =  c.toDataURL('image/png');
    $.ajax({
        type: "POST",
        url: "/sendPNG",
        data: {png: dataURL},
        success: function(data, textStatus, jqXHR) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error=" + errorThrown);
        }
    });
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