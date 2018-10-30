var connection=require('express-myconnection');
var mysql=require('mysql');

var con=mysql.createConnection({
  host:"localhost/phpmyadmin",
  user:"root",
  database:"sdc"
});
//Z3apbUnvi5LQKClu
con.connect(function(err){
  if(err)
    throw err;
  console.log("Cnnected");

});
module.exports= con;
