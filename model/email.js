
var config = require("./config").config;
(function(){
		var mysql      = require('mysql');
		var connection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : '123456',
		  port: '3306',
		  charset: 'utf-8',
		  database: 'instagram'
		});

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