var con = require("../../models/mysql"),
  ses = require("node-ses"),
  async = require("async"),
  controller = require("../../models/config");
// nodemailer = require('nodemailer');

module.exports = {
  index: function(req, res) {},

  initials: function(req, res) {
    console.log("dean initials");
    console.log(req.query);
    var college_name = req.query.college_name;
    var dean_id = req.query.dean_id;
    var password = req.query.password;
    var query =
      "select * from employee where instructor_id = ? and password = ?";
    console.log(college_name, dean_id, password);
    if (college_name != null && dean_id != null && password != null) {
      //Check For all fields
      con.query(query, [dean_id, password], function(error, result) {
        console.log(query);
        console.log(result);
        if (error) {
          console.log(error);
          var obj = { status: 400, message: "There is error in query!" };
          res.json(obj);
        } else if (result[0] == null) {
          console.log("No Dean Found");
          var obj = { status: 400, message: "No Such User Found ! ." };
          res.json(obj); // Invalid Password or username
        } else {
          console.log(result[0]);
          req.session.dean = result[0];
          req.session.dean.college_name = req.query.college_name;
          console.log(req.session.dean);
          var obj = { status: 200, message: "Dean authentication Successfull" };
          res.json(obj); //Successfull
        }
      });
    } else {
      console.log("Not All Fields Set");
      var obj = { status: 400, message: "Not All Fields Set" };
      res.json(obj);
    }
  },

  checksession: function(req, res) {
    /*  This route is just to check if sessions are working .
			Hit this url once you have logged in.	*/
    if (req.session.dean) {
      console.log(req.session.dean);
      res.json(req.session.dean);
    } else {
      console.log("No session detected");
      var obj = { status: 200, message: "No session detected" };
    }
  },
  dashboard: function(req, res) {
    var year = req.query.year;
    var semester = Number(req.query.semester);
    var college_name = req.query.college_name;

    if (year == null || semester == null || college_name == null) {
      var obj = { status: 400, message: "Not All Fields Set" };
      res.json(obj);
    } else {
      var tables = {
        batch_allocation: college_name + "_batch_allocation",
        subject_allocation: college_name + "_subject_allocation_" + year,
        feedback: college_name + "_feedback_" + year,
        employee: "employee"
      };

      console.log(tables);
      var query =
        " select * from " +
        tables.subject_allocation +
        " as s  " +
        " inner join  " +
        tables.batch_allocation +
        " as b on s.batch_id = b.batch_id " +
        " inner join  " +
        tables.employee +
        " as e on s.instructor_code =e.instructor_id " +
        " inner join  " +
        tables.feedback +
        " as f on s.feedback_id = f.feedback_id where f.no_of_students_evaluated !=0";
      console.log(query);
      con.query(query, function(error, result) {
        console.log(result);
        if (error) {
          console.log(error);
          var obj = { status: 400, message: "There is error in query!" };
          res.json(obj); // Connection Error
        } else if (result[0] == null) {
          console.log("No Dean Found");
          var obj = { status: 400, message: "No Such User Found ! ." };
          res.json(obj); // Invalid Password or username
        } else {
          console.log("Data fetched");
          console.log(result);
          res.json(result);
        }
      });
    }
  }
};
