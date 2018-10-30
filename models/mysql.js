var connection = require("express-myconnection");
var mysql = require("mysql");

//localhost phpmyadmin
//
var con = mysql.createConnection({
<<<<<<< HEAD
	host: 'localhost',
	user: 'root',
	password: '9630',
	database: 'sdc'
=======
  host: "localhost",
  user: "root",
  database: "SDC",
  password: "silentlad"
>>>>>>> remotes/origin/Student_Data_Portal
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected");
});
module.exports = con;
