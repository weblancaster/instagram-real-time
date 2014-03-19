
var config = require("./config").config;
(function(){
		var mysql      = require('mysql');
		module.exports.insert = function(email){
			var connection = mysql.createConnection(config.mysql);
			connection.connect();
			var createdDate = (new Date()).getTime();
			var sql    = "INSERT INTO `emails`(`id`, `createdDate`, `email`) VALUES (NULL, '"+createdDate+"',"+connection.escape(email)+")";
			//console.log(sql);
			connection.query(sql, function(err, rows, fields) {
			  //if (err) throw err;
			 // console.log(err);
			});
			connection.end();
		}
})(this);