var con = require("../../models/mysql"),
  ses = require("node-ses"),
  async = require("async"),
  controller = require("../../models/config");
process.env.year = 2018;
// nodemailer = require('nodemailer');
//  year=18;
module.exports = {
  index: function(req, res) {},
  initials: function(req, res) {
    //college_name.   //enrollment_number.    //email.     //type   //semester
    //By default email set to sjv97mhjn@gmail.com

    console.log("Hit initials");
    console.log(req.query);
    if (
      req.query.college_name == null ||
      req.query.enrollment_no == null ||
      req.query.email == null ||
      req.query.type == null ||
      req.query.semester == null
    ) {
      console.log("Not all Fields Set");
      // var obj = {
      //  status: 400,
      //  messa
      // }
      res.send("400");
    } else {
      console.log(process.env.year);
      console.log(req.query.semester);
      console.log(process.env.odd_even);
      var year =
        process.env.year - (req.query.semester - process.env.odd_even) / 2;
      console.log(year);
      year = year.toString();
      var student_table = req.query.college_name + "_student_" + year;
      var query0 =
        "select s_" +
        req.query.semester +
        " from " +
        student_table +
        " where enrollment_no = " +
        Number(req.query.enrollment_no);
      console.log(query0);
      con.query(query0, function(er3, res3) {
        if (er3) console.log(er3);
        else {
          if (res3[0]["s_" + req.query.semester]) {
            console.log(res3[0]["s_" + req.query.semester]);
            var obj = {
              message: "You have already filled your feedback, Thanks!"
            };
            console.log("user found in dump");
            res.send(obj);
          } else {
            {
              // var year = (req.query.enrollment_no.substr(req.query.enrollment_no.length-2,2));

              console.log(req.query.enrollment_no.substr(10, 12));
              console.log(req.query);
              var tablename =
                req.query.college_name + "_" + req.query.type + "_" + year;
              console.log(tablename);
              var random = Math.floor(
                Math.random() * (98989 - 12345 + 1) + 12345
              );
              console.log("random " + random);
              var query =
                " update " +
                tablename +
                " set password = " +
                random.toString() +
                ", email= ? " +
                " where enrollment_no= ?";
              con.query(
                query,
                [req.query.email.toString(), Number(req.query.enrollment_no)],
                function(err, result) {
                  if (err) {
                    console.log(err);
                    res.send("400"); // SQL ERROR
                  } else if (result.changedRows == 0) {
                    console.log("No User Found"); // No User Found
                    res.json("400");
                  } else {
                    // nodemailer.createTestAccount((err, account) => {
                    //   var transporter = nodemailer.createTransport({
                    //     service: 'gmail',
                    //     auth: {
                    //       user: process.env.email,
                    //       pass: process.env.password,
                    //     }
                    //   });

                    //   var mailOptions = {
                    //     from: process.env.email,
                    //     to: req.query.email,
                    //     subject: 'Noreply@FacultyFeedbackSystem',
                    //     text: 'Hi, Please Use this OTP : ' + random
                    //   };
                    //   transporter.sendMail(mailOptions, function (error, info) {
                    //     if (error) {
                    //       console.log(error);
                    //     } else {
                    //       console.log('Email sent: ' + info.response);
                    //       res.send("200");
                    //     }
                    //   });

                    // });
                    console.log("Email sent: ");
                    res.send("200");
                  }
                }
              );
            }
          }
        }
      });
    }
  },
  verify: function(req, res) {
    // var token  = Math.floor(Math.random()*(98989 - 12345 + 1) + 12345 );
    console.log("Hit verify");
    console.log(req.query);
    if (
      req.query.tablename == null ||
      req.query.enrollment_no == null ||
      req.query.password == null
    ) {
      console.log("Not all fields set");
      res.send("400");
    } else {
      var year =
        process.env.year - (req.query.semester - process.env.odd_even) / 2;
      year = year.toString();
      console.log(year);
      var tablename = req.query.tablename + "_" + year;
      console.log(tablename);
      var enrollment_no = Number(req.query.enrollment_no);
      console.log(enrollment_no);
      var password = req.query.password;
      console.log(password);
      var query =
        " select *" +
        " from " +
        tablename +
        " where enrollment_no = " +
        enrollment_no;
      con.query(query, function(err, result) {
        if (err) {
          console.log(err);
          res.status(400);
        } else {
          //console.log(result);
          if (password != result[0].password) {
            console.log("Password Did Not match");
            res.status(400);
          } else {
            console.log(result[0]);
            var temp = tablename.split("_");
            var Userinfo = {
              enrollment_no: result[0].enrollment_no,
              name: result[0].name,
              tablename: tablename,
              college_name: temp[0],
              year: year,
              stream: result[0].stream,
              course: result[0].course,
              email: result[0].email,
              semester: req.query.semester,
              year_of_admission: result[0].year_of_admission
            };
            req.session.student = Userinfo;
            console.log(req.session.student);
            //console.log(Userinfo);
            res.json(Userinfo);
          }
        }
      });
    }
  },
  dashboard: function(req, res) {
    console.log("Hit dashboard");
    var enrollment_no = Number(req.session.student.enrollment_no);
    var tablename =
      req.session.student.college_name + "_student_" + req.session.student.year;
    var query =
      "select * from " + tablename + " where enrollment_no = " + enrollment_no;
    con.query(query, function(err, result) {
      if (err) {
        console.log(err);
        res.send(400);
      }
      console.log(result);
      res.json(result);
    });
    // res.json(req.session.user);
  },

  edit: function(req, res) {
    var phone = req.query.phone;
    var tablename = req.query.tablename;
    if (tablename && phone) {
      var query =
        " update  " +
        tablename +
        " set phone=?" +
        " where enrollment_no = " +
        req.query.enrollment_no;
      console.log(query);
      con.query(query, [phone], function(err, result) {
        if (err) {
          console.log(err);
          res.status(400);
        } else {
          console.log(result);
          res.send("200");
        }
      });
    } else {
      console.log("Not all data set");
      res.send("400");
    }
  },

  feedbackform: function(req, res) {
    console.log("Hit Feedback Form");
    console.log(req.session.student);
    if (
      req.session.student.course &&
      req.session.student.stream &&
      req.session.student.year &&
      req.session.student.college_name
    ) {
      console.log(req.session.student);
      var college_name = req.session.student.college_name;

      var tablename1 = college_name + "_subject_allocation";
      var tablename2 = college_name + "_batch_allocation";
      var tablename3 = "employee";
      var student = {
        course: req.session.student.course,
        stream: req.session.student.stream,
        semester: req.session.student.semester
      };
      //if(process.env.year=='2017')
      var tablename1 = college_name + "_subject_allocation_2017"; //Changes Every Year
      var query =
        " select s.feedback_id,s.batch_id,s.subject_code,s.instructor_code, " +
        " s.subject_name,s.type,b.course,b.stream,b.semester,t.name as teacher " +
        " from " +
        tablename1 +
        " as s " +
        " inner join " +
        tablename2 +
        " as b on s.batch_id = b.batch_id " +
        " inner join " +
        tablename3 +
        " as t on t.instructor_id = s.instructor_code " +
        " where b.course=? and b.stream =? and b.semester = ?";
      console.log(query);
      con.query(
        query,
        [student.course, student.stream, student.semester],
        function(err, result) {
          if (err) {
            console.log(err);
            res.status(400);
          } else {
            console.log(result);
            res.json(result);
          }
        }
      );
    } else {
      console.log("Not all fields set");
      res.send("400");
    }
  },

  feedback: function(req, res) {
    //res.send(req.session.student);
    console.log(req.session.student);
    var tablename = req.session.student.college_name + "_feedback_2017"; //Changes Every Year
    var feedbacks = req.body.teacherFeedback;

    var dumptable = req.session.student.college_name + "_dump_2017";
    var enr = req.session.student.enrollment_no.toString();
    var year = req.session.student.year_of_admission;
    var semester = req.session.student.semester;
    console.log(semester);
    var table3 = req.session.student.college_name + "_student_" + year;
    console.log(table3);
    console.log(req.session.student.enrollment_no);
    var query3 =
      "update " +
      table3 +
      " set s_" +
      semester +
      " = 1 where enrollment_no = ?";

    //var hanu =0;
    if (
      req.session.student.college_name == null ||
      feedbacks == null ||
      req.session.student.enrollment_no == null
    ) {
      console.log("Not All Fields set");
      res.send("400");
    } else {
      var error = 0;
      async.each(
        feedbacks,
        function(feedback, callback) {
          hanu = 0;
          //console.log(feedback);
          var result = feedback.score;
          if (result.length == 15 && feedback.feedbackId != null) {
            // console.log("nothing");
            var query =
              "update " +
              tablename +
              " set" +
              " at_1 = concat(at_1,?),  at_2 = concat(at_2,?),  at_3 = concat(at_3,?), " +
              " at_4 = concat(at_4,?),  at_5 = concat(at_5,?),  at_6 = concat(at_6,?), " +
              " at_7 = concat(at_7,?),  at_8 = concat(at_8,?),  at_9 = concat(at_9,?), " +
              " at_10 = concat(at_10,?),at_11 = concat(at_11,?),at_12 = concat(at_12,?), " +
              " at_13 = concat(at_13,?),at_14 = concat(at_14,?),at_15 = concat(at_15,?) ," +
              " no_of_students_evaluated =  no_of_students_evaluated + 1 ," +
              " total = total + ? " +
              "where feedback_id = " +
              feedback.feedbackId;
            // console.log("something");
            var query2 =
              "insert into " +
              dumptable +
              " (enrollment_no,subject_code,instructor_id,attribute_1,attribute_2," +
              "attribute_3,attribute_4,attribute_5,attribute_6,attribute_7,attribute_8,attribute_9," +
              "attribute_10,attribute_11,attribute_12,attribute_13,attribute_14,attribute_15) " +
              "values ( " +
              req.session.student.enrollment_no +
              " , ? , ? ," +
              result[0] +
              "," +
              result[1] +
              "," +
              result[2] +
              "," +
              result[3] +
              "," +
              result[4] +
              "," +
              result[5] +
              "," +
              result[6] +
              "," +
              result[7] +
              "," +
              result[8] +
              "," +
              result[9] +
              "," +
              result[10] +
              "," +
              result[11] +
              "," +
              result[12] +
              "," +
              result[13] +
              "," +
              result[14] +
              ")";
            // console.log(query2);

            var sum = 0;
            for (
              i = 0;
              i <= 14;
              i++ //check;
            ) {
              result[i] = Math.round(Number(result[i]));
              if (result[i] > 5 && result[i] < 1) {
                console.log("Incorrect Data");
                res.send("400");
              } else {
                sum = sum + Number(result[i]);
              }
            }
            con.query(
              query,
              [
                result[0],
                result[1],
                result[2],
                result[3],
                result[4],
                result[5],
                result[6],
                result[7],
                result[8],
                result[9],
                result[10],
                result[11],
                result[12],
                result[13],
                result[14],
                sum
              ],
              function(err, Result) {
                if (err) console.log(err);
                else {
                  //console.log("query1",Result);
                  con.query(
                    query2,
                    [
                      feedback.subject_code,
                      feedback.instructor_code.toString()
                    ],
                    function(err3, result3) {
                      if (err3) {
                        console.log(err3);
                      } else {
                        //console.log("query2", result3);
                        con.query(
                          query3,
                          [Number(req.session.student.enrollment_no)],
                          function(err4, res4) {
                            if (err4) {
                              console.log(err4);
                            } else {
                              //console.log("query3", res4);
                              //console.log(res4);
                              console.log(
                                "theory feedback id " +
                                  feedback.feedbackId +
                                  " of length " +
                                  result.length +
                                  " updated "
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          } else if (result.length == 8 && feedback.feedbackId != null) {
            var query =
              "update " +
              tablename +
              " set" +
              " at_1 = concat(at_1,?),  at_2 = concat(at_2,?),  at_3 = concat(at_3,?), " +
              " at_4 = concat(at_4,?),  at_5 = concat(at_5,?),  at_6 = concat(at_6,?), " +
              " at_7 = concat(at_7,?),  at_8 = concat(at_8,?), " +
              " no_of_students_evaluated =  no_of_students_evaluated + 1 ," +
              " total = total + ? " +
              "where feedback_id = " +
              feedback.feedbackId;
            // console.log("nothing");
            var query2 =
              "insert into " +
              dumptable +
              " (enrollment_no,subject_code,instructor_id,attribute_1,attribute_2," +
              "attribute_3,attribute_4,attribute_5,attribute_6,attribute_7,attribute_8) " +
              "values ( " +
              req.session.student.enrollment_no +
              " , ? , ? ," +
              result[0] +
              "," +
              result[1] +
              "," +
              result[2] +
              "," +
              result[3] +
              "," +
              result[4] +
              "," +
              result[5] +
              "," +
              result[6] +
              "," +
              result[7] +
              ")";

            // console.log(query2);

            // console.log("Something");

            var sum = 0;
            for (
              i = 0;
              i <= 7;
              i++ //check;
            ) {
              result[i] = Math.round(Number(result[i]));
              if (result[i] > 5 && result[i] < 1) {
                res.send("Incorrect Data");
              } else {
                sum = sum + Number(result[i]);
              }
            }
            //coo

            con.query(
              query,
              [
                result[0],
                result[1],
                result[2],
                result[3],
                result[4],
                result[5],
                result[6],
                result[7],
                sum
              ],
              function(err, Result) {
                if (err) console.log(err);
                else {
                  // console.log("practical query 1", Result);
                  con.query(
                    query2,
                    [
                      feedback.subject_code,
                      feedback.instructor_code.toString()
                    ],
                    function(err3, result3) {
                      if (err3) {
                        console.log(err3);
                      } else {
                        //console.log("feedback id " +feedback.feedbackId + ' of length '+ result.length +' updated ')
                        //  console.log("practical query 2" , result3);
                        con.query(
                          query3,
                          [Number(req.session.student.enrollment_no)],
                          function(err4, res4) {
                            if (err4) {
                              console.log(err4);
                            } else {
                              //console.log(res4);
                              //  console.log("practical query 3 ", res4);
                              console.log(
                                "Practical feedback id " +
                                  feedback.feedbackId +
                                  " of length " +
                                  result.length +
                                  " updated "
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          } else {
          }

          callback();
        },
        function(err) {
          if (err || hanu == 1) {
            console.error(err);
            res.status(err);
          } else {
            // nodemailer.createTestAccount((err, account) => {
            //   var transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //       user: process.env.email,
            //       pass: process.env.password,
            //     }
            //   });

            //   var mailOptions = {
            //     from: process.env.email,
            //     to: req.session.student.email, //Require user email at last as well
            //     subject: 'Noreply@ffs',
            //     text: 'Thank You For Your feedback. Your feedback has been recorded .'
            //   };

            //   transporter.sendMail(mailOptions, function (error, info) {
            //     if (error) {
            //       console.log(error);
            //       res.send("400")
            //     } else {
            //       console.log('Email sent: ' + info.response);
            //       res.send("200");
            //     }
            //   });

            // });
            console.log("Email not sent: ");
            res.send("200");
          }
        }
      );
    }
  },

  getStudentStatus: function(req, res) {
    var collegeName = req.query.collegeName;
    var semester = parseInt(req.query.semester);
    var course = req.query.course;
    var stream = req.query.stream;

    var year = 2017 - (semester + odd_even) / 2;

    var query =
      "select enrollment_no, name, s_" +
      semester +
      " from " +
      collegeName +
      "_student_" +
      year +
      " where" +
      " course='" +
      course +
      "' AND stream='" +
      stream +
      "'";

    console.log(query);

    con.query(query, function(err, userStatus) {
      if (err) {
        console.log(err);
        res.json("400");

        return;
      }

      //console.log(userStatus)
      res.json(userStatus);
      return;
    });
  },

  getStudentDetails: function(req, res) {
    var collegeName = req.query.collegeName;
    var semester = parseInt(req.query.semester);
    var year = 2017 - (semester + odd_even) / 2;

    var userDetails = {
      stream: [],
      course: []
    };

    if (process.env.year) {
      var query =
        "select distinct stream from " + collegeName + "_student_" + year;
    }

    console.log(query);
    con.query(query, function(err, stream) {
      if (err) {
        console.error(err);
        res.json("400");
        return;
      }
      userDetails.stream = stream;

      var query2 =
        "select distinct course from " + collegeName + "_student_" + year;
      con.query(query2, function(err, course) {
        if (err) {
          console.error(err);
          res.json("400");
          return;
        }

        //console.log(query2); //03669900117
        userDetails.course = course;
        userDetails.stream = stream;

        res.json(userDetails);
        return;
      });
    });
  },

  // {
  //   "college_name":"usict",
  //   "course":"BTECH",
  //   "stream":"CSE",
  //   "data":[{
  //     "enrollment_no":123345,
  //     "name": "Divyansh",
  //     "email": "divyansh2998@icloud.com",
  //     "phone":"12378274"
  //   }]
  // }

  studentData: function(req, res) {
    if (process.env.year == 2018) {
      var tableName = `${req.body.college_name}_student_${process.env.year}`;
      var initQuery =
        "CREATE TABLE IF NOT EXISTS ? (`enrollment_no` bigint(20) NOT NULL,`name` varchar(100) NOT NULL,`email` varchar(100) DEFAULT NULL,`phone` varchar(100) DEFAULT NULL,`year_of_admission` int(4) NOT NULL,`password` varchar(600) NOT NULL,`course` varchar(100) NOT NULL,`stream` varchar(100) NOT NULL,`s_1` int(11) DEFAULT '0',`s_9` int(11) DEFAULT '0',`s_8` int(11) DEFAULT '0',`s_5` int(11) DEFAULT '0',`s_6` int(11) DEFAULT '0',`s_4` int(11) DEFAULT '0',`s_3` int(11) DEFAULT '0',`s_2` int(11) DEFAULT '0',`s_7` int(11) DEFAULT '0',`s_10` int(11) DEFAULT '0') ENGINE=InnoDB DEFAULT CHARSET=latin1;";
      con.query(initQuery, [tableName], err => {
        if (err) {
          res.status(500).send(
            JSON.stringify({
              err,
              dataInserted: false,
              message: "Init Query Failed"
            })
          );
        }
      });
      async.each(
        req.body.data,
        (student, callback) => {
          var query =
            "INSERT INTO ? (`enrollment_no`, `name`, `email`, `phone`, `year_of_admission`, `password`, `course`, `stream`, `s_1`, `s_9`, `s_8`, `s_5`, `s_6`, `s_4`, `s_3`, `s_2`, `s_7`, `s_10`) VALUES " +
            "(?,?,?,?,?,0000,?,?)";
          con.query(
            query,
            [
              tableName,
              student.enrollment_no,
              student.name,
              student.email,
              student.phone,
              process.env.year,
              req.body.course,
              req.body.stream
            ],
            err => {
              if (err) {
                callback(err);
              } else {
                callback();
              }
            }
          );
        },
        err => {
          if (err) {
            console.log(err);
            res.status(500).send("Query Insertion Failed");
          } else {
            console.log("Insertion Complete");
            res.status(200).json({
              dataInserted: true,
              message: "Success"
            });
          }
        }
      );
    } else {
      res.status(500).send("Server Down");
    }

    // var details = req.query;
    // console.log(req.query);

    // async.each(
    //   details.data,
    //   function(detail, callback) {
    //     detail = JSON.parse(detail);
    //     if (detail["cells"][0] != "") {
    //       var enrollment_number = detail["cells"][0].value;
    //       // console.log(enrollment_number);
    //       var school = details.college;
    //       var course = details.course;
    //       var stream = details.stream;
    //       var year = parseInt(details.year, 10);
    //       var name = detail["cells"][1].value;
    //       var email = detail["cells"][2].value;
    //       var phone = detail["cells"][3].value;
    //       var password = detail["cells"][4].value;
    //       var student_table = school + "_student_" + year;
    //       var query0 =
    //         "create table if not exists " +
    //         student_table +
    //         "(enrollment_no bigint(20), name varchar(100), email varchar(100), phone varchar(100), year_of_admission int(4), password varchar(600), course varchar(100), stream varchar(100))";
    //       con.query(query0, function(err) {
    //         if (err) {
    //           console.error("Error connecting: " + err.stack);
    //           throw err;
    //         } else {
    //           console.log("table created");
    //           var query =
    //             "insert into " + student_table + " values (?,?,?,?,?,?,?,?);";
    //           con.query(
    //             query,
    //             [
    //               enrollment_number,
    //               name,
    //               email,
    //               phone,
    //               year,
    //               password,
    //               course,
    //               stream
    //             ],
    //             function(err) {
    //               if (err) {
    //                 // console.error(err);
    //                 callback(err);
    //                 // console.log(query);
    //               } else {
    //                 console.log(res.body);
    //               }
    //             }
    //           );
    //         }
    //       });
    //     }
    //   },
    //   function(error) {
    //     if (error) {
    //       console.log(error);
    //       var obj = {
    //         status: 400,
    //         message: "Something went wrong!! Please try again"
    //       };
    //     } else {
    //       var obj = {
    //         status: 200,
    //         message: "Your data is recorded"
    //       };
    //       res.json(obj);
    //     }
    //   }
    // );
  },

  updateStudent: function(req, res) {
    var course = "MCA";
    var stream = "SE";
    var college = "usict";
    var year = 2018;
    // var course= req.body.course;
    // var stream= req.body.stream;
    // var college= req.body.college;
    // var year=Number(req.body.year);

    if (course == null || stream == null || college == null || year == null) {
      console.log("Not all Fields Set");
      var obj = {
        status: 400,
        message: "something went wrong"
      };
      res.json(obj);
    } else {
      year = year.toString();
      var query =
        "select * from " +
        college +
        "_student_" +
        year +
        " where" +
        " course='" +
        course +
        "' AND stream='" +
        stream +
        "'";

      console.log(query);

      con.query(query, function(err, userStatus) {
        if (err) {
          console.log("query didn't run");
          console.log(err);
          res.json("400");

          return;
        } else {
          //console.log(userStatus);
          res.send(userStatus);
          //res.json(userStatus);
          return;
        }
      });
    }
  }
};
