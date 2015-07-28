var request = require('request')

var google = 'https://www.google.com/searchbyimage';
var d = new Date();
var image = 'http://ruby-on-rails-114302.nitrousapp.com:3000/assets/canvasImg.png?timestamp='+d.getTime();

var options = {
  url: google,
  qs: { image_url: image },
  headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11' }
};

request(options, function (err, res, body) {
  //console.log(body);
  //console.log(body.length);
  var i = body.indexOf("var data=[[[");
  if(i != -1){
    i = body.indexOf("base64",i+1);
    i+=7;
    var e = body.indexOf("]",i);
    console.log(body.substring(i,e-1));
    e = getResults(body, e);
    e = getResults(body, e);
  }
  else
    console.log("none\n"+body);
  //getBase64(body);
});

function getResults(body, e){
  var i = body.indexOf("base64",e);
  i+=7;
  var e = body.indexOf("]",i);
  console.log((body.substring(i,e)).replace("\\u003d", "="));
  return e;
}

function getBase64(body){
  var i = 0;
  while(i != -1){
    //i = body.indexOf("var data=[[[",i+1);
    i = body.indexOf("base64",i+1);
    console.log(body.substring(i-100,i+100));
    console.log("=================");
  }
  //console.log(body.length);
  //console.log(body);
};