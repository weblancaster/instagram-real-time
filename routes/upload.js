
var DropboxClient = require('dropbox-node').DropboxClient;
var http = require('http');
var fs = require('fs');
var path = require('path'),
appDir = path.dirname(require.main.filename);
var config = require("../model/config").config;

imgFolder = appDir +config.imgfoldername;
/**
 * generate file with random name
 * @param url image url to get extension of file
 * @returns {String} return filename with extension
 */

function getRandomFileName(url){
	var extension = url.split('.').pop();
	 var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
	    for( var i=0; i < 50; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	    return text +"."+ extension;
};
/*
* upload file to dropbox
*/
exports.upload = function(url, req, res){
	var filename = getRandomFileName(url);
	var locationPath = imgFolder + filename;
	var file = fs.createWriteStream(locationPath);
	var request = http.get(url, function(response) {
		response.on('end', function(){
			var dropbox = new DropboxClient(config.dropbox.consumer_key, config.dropbox.consumer_secret, 
					config.dropbox.oauth_token, config.dropbox.oauth_token_secret);
			dropbox.putFile(locationPath, filename, function (err, data) {
				//console.log(data);
				if (err) return; //console.error(err)
			});
			res.send({filename: filename});
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