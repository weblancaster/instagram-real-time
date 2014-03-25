
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
exports.upload = function (img, req, res) {
	
	var filename = getRandomFileName(img.url);
	var locationPath = imgFolder + filename;
	var file = fs.createWriteStream(locationPath);
	file.on('error', function(err) {
		res.send(err);
	});
	http.get(img.url, function(respone) {
		respone.on('data', function(data) {
				file.write(data);
			}).on('end', function() {
				file.end();
				var dropbox = new DropboxClient(config.dropbox.consumer_key, config.dropbox.consumer_secret, 
					config.dropbox.oauth_token, config.dropbox.oauth_token_secret),
					dropboxPath = [config.dropbox.image_folder[img.type], filename].join("/");
				
				dropbox.putFile(locationPath, dropboxPath, function (err, data) {
					if(err) {
						console.log(err);
					}
				});
				
				res.send({filename: filename});
			});
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