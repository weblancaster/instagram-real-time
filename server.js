var express = require("express");
var app = express();
var port = process.env.PORT || 3700;
var io = require('socket.io').listen(app.listen(port));
var Instagram = require('instagram-node-lib');
var http = require('http');
var request = ('request');
var intervalID;
var Dropbox         = require('dropbox');
var uploader = require('./routes/upload');
var mail = require("./routes/mail");
var emailModel = require("./model/email");

/** 
 * this code is being used to integrate Dropbox account with Dropbox app 
 */
/*
var config = require('./model/config').config;

var dbox  = require("dbox");
var app   = dbox.app({ "app_key": config.dropbox.consumer_key, "app_secret": config.dropbox.consumer_secret });
var reqToken ;
app.requesttoken(function(status, request_token){
	console.log(request_token);
});
return;

app.accesstoken({ 
	  oauth_token_secret: 'eCR4JyK5YErZmFic',
	  oauth_token: 'FcCHC3xhb3lLWT9V',
	  authorize_url: 'https://www.dropbox.com/1/oauth/authorize?oauth_token=FcCHC3xhb3lLWT9V' }, function(status, access_token){
	  console.log(access_token);
});
return;
*/



/**
 * Set the paths for your files
 * @type {[string]}
 */
var pub = __dirname + '/public',
    view = __dirname + '/views';

/**
 * Set the 'client ID' and the 'client secret' to use on Instagram
 * @type {String}
 */
var clientID = 'f0ba06d272b14a9684be7544addb413e',
    clientSecret = 'b12a9368332b4a63aa2c38328757c819';

/**
 * Set the configuration
 */
Instagram.set('client_id', clientID);
Instagram.set('client_secret', clientSecret);
Instagram.set('callback_url', 'http://instagram-real-time.herokuapp.com/callback');
Instagram.set('redirect_uri', 'http://instagram-real-time.herokuapp.com');
Instagram.set('maxSockets', 10);

/**
 * Uses the library "instagram-node-lib" to Subscribe to the Instagram API Real Time
 * with the tag "hashtag" lollapalooza
 * @type {String}
 */
Instagram.subscriptions.subscribe({
  object: 'tag',
  object_id: 'nba',
  aspect: 'media',
  callback_url: 'http://instagram-real-time.herokuapp.com/callback',
  type: 'subscription',
  id: '#'
});

/**
 * Uses the library "instagram-node-lib" to Subscribe to the Instagram API Real Time
 * with the tag "hashtag" lollapalooza2013
 * @type {String}

Instagram.subscriptions.subscribe({
  object: 'tag',
  object_id: 'throwback',
  aspect: 'media',
  callback_url: 'http://instagram-real-time.herokuapp.com/callback',
  type: 'subscription',
  id: '#'
});
 */
/**
 * Uses the library "instagram-node-lib" to Subscribe to the Instagram API Real Time
 * with the tag "hashtag" lolla2013
 * @type {String}
 
Instagram.subscriptions.subscribe({
  object: 'tag',
  object_id: 'throwback',
  aspect: 'media',
  callback_url: 'http://instagram-real-time.herokuapp.com/callback',
  type: 'subscription',
  id: '#'
});
*/
// if you want to unsubscribe to any hashtag you subscribe
// just need to pass the ID Instagram send as response to you
Instagram.subscriptions.unsubscribe({ id: '4386982' });

// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});


/**
 * Set your app main configuration
 */
app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(pub));
    app.use(express.static(view));
    app.use(express.errorHandler());
});

/**
 * Render your index/view "my choice was not use jade"
 */
app.get("/views", function(req, res){
    res.render("index");
});

// check subscriptions
//https://api.instagram.com/v1/subscriptions?client_secret=b12a9368332b4a63aa2c38328757c819&client_id=f0ba06d272b14a9684be7544addb413e

//https://api.instagram.com/v1/users/2205456/media/recent/?client_id=f0ba06d272b14a9684be7544addb413e
//2205456 is my user id
//https://api.instagram.com/v1/users/search?q=ewansou&client_id=f0ba06d272b14a9684be7544addb413e data.id will be the user id
//append user id to get 



/**
 * On socket.io connection we get the most recent posts
 * and send to the client side via socket.emit
 */
io.sockets.on('connection', function (socket) {
  Instagram.tags.recent({ 
      name: 'nba',
      complete: function(data) {
        socket.emit('firstShow', { firstShow: data });
      }
  });
});
/**
 * Needed to receive the handshake
 */
app.get('/callback', function(req, res){
    var handshake =  Instagram.subscriptions.handshake(req, res);
});

/**
 * for each new post Instagram send us the data
 */
app.post('/callback', function(req, res) {
    var data = req.body;

    // Grab the hashtag "tag.object_id"
    // concatenate to the url and send as a argument to the client side
    data.forEach(function(tag) {
      var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id=f0ba06d272b14a9684be7544addb413e';
      sendMessage(url);

    });
    res.end();
});

/**
 * upload image to dropbox
 */
app.post('/upload', function(req, res){
     var img = req.body.img;
	 var rootPath = __dirname;

     uploader.upload(rootPath, img, req, res);
});
/**
 * 
 */
app.post('/sendmail', function(req, res){
	
     var email = req.body.mail;
     var filename = req.body.filename;
     
     mail.sendMail(email, filename);
     mail.subscribe(email);
     mail.insert(email);
	 
     res.end();
});

/**
 * clean up temporary image folder
 */
app.get("/cleanup", function(req, res){
	uploader.removeTempFile();
	res.end();
});

/**
 * Send the url with the hashtag to the client side
 * to do the ajax call based on the url
 * @param  {[string]} url [the url as string with the hashtag]
 */
function sendMessage(url) {
  io.sockets.emit('show', { show: url });
}

console.log("Listening on port " + port);
console.log("ewan rocks");

