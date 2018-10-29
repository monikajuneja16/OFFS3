var connection=require('express-myconnection');
var mysql=require('mysql');


//localhost phpmyadmin
//
var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '9630',
	database: 'sdc'
});
con.connect(function(err) {
	if (err) throw err;
	console.log('Connected');
});
module.exports = con;
