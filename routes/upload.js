
var DropboxClient = require('dropbox-node').DropboxClient;
var http = require('http');
var fs = require('fs');
var path = require('path'),
appDir = path.dirname(require.main.filename);
var config = require("../model/config").config;

var imgFolder = appDir +config.imgfoldername;

/**
 * generate file with random name
 * @param url image url to get extension of file
 * @returns {String} return filename with extension
 */

function getRandomFileName(url){
	var extension = url.split('.').pop();
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
	
	for( var i=0; i < 50; i++ ) {
	    text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text +"."+ extension;
};
/*
* upload file to dropbox
*/
exports.upload = function (url, req, res) {
	
	res.send({"msg": "start 1"});
	
	var filename = getRandomFileName(url);
	res.send({"msg": filename});
	
	var locationPath = imgFolder + filename;
	res.send({"locationPath": locationPath});
	var file = fs.createWriteStream(locationPath);
	res.send({"msg": "pass here create write stream"});
	var request = http.get(url, function (response) {
		res.send({"msg": "start get file" + url});
		response.on('end', function(){
			res.send({"end file": "dropbox get file"});
			var dropbox = new DropboxClient(config.dropbox.consumer_key, config.dropbox.consumer_secret, 
					config.dropbox.oauth_token, config.dropbox.oauth_token_secret),
					dropboxPath = config.dropbox.image_folder +filename;
			//console.log(dropboxPath);
			res.send({"config dropbox": "dropbox get file"});
			dropbox.putFile(locationPath, dropboxPath, function (err, data) {
				if(err) {
					console.log(err);
				}
			});
			
			res.send({filename: filename});
			res.end();
		});
		response.on('error', function(msg){
			res.send({msg});
			res.end();
		});
		response.pipe(file);
	 
	});
};
/**
 * remove temporary image file
 */
exports.removeTempFile = function(){
	fs.readdir(imgFolder, function(err, files){
		for(file in files){
			var stats = fs.statSync(imgFolder+files[file]);
			if(stats.isFile()){
				var timeOffset = ((new Date()).getTime() - stats.mtime.getTime())/(1000 * 60 * 60 * 24);
				//if exist time is more than 1 day => remove
				if(timeOffset > 1){
					fs.unlink(imgFolder+files[file]);
				}
			}
		}
	});
}