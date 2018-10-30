<<<<<<< HEAD
var con         = require("../../models/mysql"),
    ses         = require('node-ses'),
    async       = require('async'),
    controller  = require("../../models/config"),
    nodemailer  = require('nodemailer');
    student     = require('../../models/student');

//  year=18;
module.exports = {

  index: function (req, res) {

  },
  initials:function(req,res) {
    console.log("Hit initials");
    console.log(req.query);

    if(req.query.college_name==null||req.query.enrollment_no==null||req.query.email==null||req.query.type==null||req.query.semester==null) {
      console.log("Not all Fields Set");
      res.send("400");
      return;
    }

    var type          = req.query.type;
    var semester      = req.query.semester;
    var year          = process.env.year - (req.query.semester - process.env.odd_even)/2;
    year              = year.toString();
    var college_name  = req.query.college_name;
    var tablename     = college_name + '_' + type + '_' + year;
    var random        = Math.floor(Math.random()*(98989 - 12345 + 1) + 12345 );
    var email         = req.query.email.toString();
    var password      = random;
    var enrollment_no = Number(req.query.enrollment_no);

    console.log(process.env.year);
    console.log(req.query.semester);
    console.log(process.env.odd_even);
    console.log(year);


    student.checkLogin(college_name, year, semester, enrollment_no, function(er3, res3) {
      if(er3) {
        console.log(er3);
        throw er3;
      }

      if(res3[0]['s_' + semester]) {
        console.log(res3[0]['s_' + semester]);
        var obj = {'message' : "You have already filled your feedback, Thanks!"}
        console.log("user found in dump");
        res.send(obj);

      } else {
          // var year = (req.query.enrollment_no.substr(req.query.enrollment_no.length-2,2));

          console.log(req.query.enrollment_no.substr(10,12));
          console.log(req.query);
          console.log(tablename);
          console.log("random "+ random);

          student.login(tablename, password, email, enrollment_no, function(err, result) {
            if (err) {
              console.log(err);
              throw err;
            }

            if(result.changedRows == 0) {
              console.log('No User Found');         // No User Found
              res.json("400");

            } else {
              console.log('ssssssssssssssssssssaaaaaaaaaaaaaaarrrrrrrrrrrrrrr');
              // nodemailer.createTestAccount((err, account) => {
              //   var transporter = nodemailer.createTransport({
              //     service: 'gmail',
              //     auth: {
              //       user:process.env.email,
              //       pass: process.env.password,
              //     }
              //   });

              //   var mailOptions = {
              //     from: process.env.email,
              //     to: req.query.email,
              //     subject: 'Noreply@FacultyFeedbackSystem',
              //     text: 'Hi, Please Use this OTP : ' +random
              //   };

              //   transporter.sendMail(mailOptions, function(error, info) {
              //     if (error) {
              //       console.log(error);
              //     } else {
              //       console.log('Email sent: ' + info.response);
              //       res.send("200");
              //     }
              //   });
              // });

              res.send("200");
            }
          })
        }
    })
  },

  verify: function(req,res) {

    if(req.query.tablename==null || req.query.enrollment_no==null || req.query.password==null) {
      console.log("Not all fields set");
      res.send("400");
      return;
    }

    var year = process.env.year - (req.query.semester - process.env.odd_even)/2;
    year = year.toString();
    var tablename = req.query.tablename + '_' + year;
    var enrollment_no = Number(req.query.enrollment_no);
    var password = req.query.password;

    console.log(year);
    console.log(tablename);
    console.log(enrollment_no);
    console.log(password);

    student.getInformation(tablename, enrollment_no, function(err, result) {
      if (err) {
        console.log(err);
        throw err;

      } else {

        if(password != result[0].password) {
          console.log("Password Did Not match");
          res.status(400);
        } else {
          console.log(result[0]);
          var temp=tablename.split("_");

          var Userinfo = {
            enrollment_no: Number(result[0].enrollment_no),
            name:result[0].name,
            tablename : tablename,
            college_name:temp[0],
            year:year,
            stream:result[0].stream,
            course:result[0].course,
            email:result[0].email,
            semester:req.query.semester,
            year_of_admission:result[0].year_of_admission
          }

          req.session.student=Userinfo;
          console.log(req.session.student);
          //console.log(Userinfo);
          res.json(Userinfo);
        }
      }
    })
  },

  dashboard:function(req,res) {
    console.log("Hit dashboard");

    var enrollment_no = req.session.student.enrollment_no;
    var tablename = req.session.student.college_name + '_student_' + req.session.student.year;

    student.getInformation(tablename, enrollment_no, function(err, result) {
      if (err) {
        console.log(err);
        res.send(400);
      }

      console.log(result);
      res.json(result);
    })
  },

  edit: function(req,res) {

    var phone     = req.query.phone;
    var tablename = req.query.tablename;

    if(tablename && phone) {

      student.editDetails(tablename, phone, enrollment_no, function(err, result) {
        if(err){
            console.log(err);
            res.status(400);
        }

        console.log(result);
        res.send("200");
      })
    } else {
        console.log("Not all data set");
        res.send("400");
    }

  },

  feedbackform : function(req,res) {
      console.log("Hit Feedback Form");
      console.log(req.session.student);

      if(req.session.student.course && req.session.student.stream && req.session.student.year && req.session.student.college_name) {
          console.log(req.session.student);
          var college_name  = req.session.student.college_name;

          var tablename1    = college_name + '_subject_allocation_2017'  ;  //Changes Every Year
          var tablename2    = college_name + '_batch_allocation';
          var tablename3    = 'employee';
          var course        = req.session.student.course;
          var stream        = req.session.student.stream;
          var semester      = req.session.student.semester;

          student.getFeedbackInfo(tablename1, tablename2, tablename3, course, stream, semester, function(err, result) {
            if(err) {
              console.log(err);
              res.status(400);
            }

            console.log(result);
            res.json(result)
          })
      } else {
        console.log("Not all fields set");
        res.send("400");
      }
  },

  feedback:function(req,res) {

      console.log(req.session.student);
      var tablename = req.session.student.college_name + '_feedback_2017'; //Changes Every Year
      var feedbacks = req.body.teacherFeedback;

      var dumptable = req.session.student.college_name + '_dump_2017' ;
      var enollment_no = req.session.student.enrollment_no.toString();
      var year =req.session.student.year_of_admission;
      var semester  = req.session.student.semester;
      var table3 = college_name + '_student_' + year;

      console.log(enrollment_no);
      console.log(semester);
      //var hanu =0;
      if(req.session.student.college_name==null||feedbacks==null||req.session.student.enrollment_no==null) {
        console.log("Not All Fields set");
        res.send("400");

      } else {
            var error=0;
            async.each(feedbacks,function(feedback,callback) {
            hanu =0;
            //console.log(feedback);
            var result = feedback.score;
            if(result.length==15 && feedback.feedbackId!=null) {
              var query='update '+ tablename+' set'+
                 ' at_1 = concat(at_1,?),  at_2 = concat(at_2,?),  at_3 = concat(at_3,?), '  +
                 ' at_4 = concat(at_4,?),  at_5 = concat(at_5,?),  at_6 = concat(at_6,?), '  +
                 ' at_7 = concat(at_7,?),  at_8 = concat(at_8,?),  at_9 = concat(at_9,?), '  +
                 ' at_10 = concat(at_10,?),at_11 = concat(at_11,?),at_12 = concat(at_12,?), '+
                 ' at_13 = concat(at_13,?),at_14 = concat(at_14,?),at_15 = concat(at_15,?) ,'+
                 ' no_of_students_evaluated =  no_of_students_evaluated + 1 ,'+
                 ' total = total + ? ' +
                    'where feedback_id = ' +feedback.feedbackId;
           // console.log("something");
            var query2 =   'insert into ' + dumptable +' (enrollment_no,subject_code,instructor_id,attribute_1,attribute_2,'+
          'attribute_3,attribute_4,attribute_5,attribute_6,attribute_7,attribute_8,attribute_9,'+
          'attribute_10,attribute_11,attribute_12,attribute_13,attribute_14,attribute_15) '+
          'values ( ' + req.session.student.enrollment_no +' , ? , ? ,'+
           result[0]+','+ result[1]+','+ result[2]+','+ result[3]+','+result[4] +','+result[5] +
          ','+ result[6]+','+result[7] +','+result[8] +','+result[9] +','+result[10] +','+result[11] +','+result[12] +','+
           result[13]+','+ result[14]+  ')';
          // console.log(query2);

            var sum=0;

            for(i=0;i<=14;i++) {
              result[i]=Math.round(Number(result[i]));

              if(result[i]>5&&result[i]<1) {
                console.log("Incorrect Data");
                res.send("400");

              } else {
                sum=sum+Number(result[i]);

              }
            };

            con.query(query,[result[0],result[1],result[2],result[3],result[4],result[5],result[6],result[7],result[8],result[9],result[10],result[11],result[12],result[13],result[14],sum],function(err,Result){
              if(err)
                console.log(err);
              else{

                //console.log("query1",Result);
                con.query(query2,[feedback.subject_code,feedback.instructor_code.toString()],function(err3,result3){
                  if(err3)
                  {
                    console.log(err3);
                  }
                  else{
                    //console.log("query2", result3);

                    student.markStudentEntry(table3, semester, Number(enrollment_no), function(err4, res4) {
                      if(err4) {
                        console.log(err4);
                        throw err4;
                      } else {
                        console.log("theory feedback id " +feedback.feedbackId + ' of length '+ result.length +' updated ');

                      }

                    })

                  }
                })

              }
            })
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
<<<<<<< HEAD
                sum=sum+Number(result[i]);
              }
            };
            //coo

            con.query(query,[result[0],result[1],result[2],result[3],result[4],result[5],result[6],result[7],sum],function(err,Result){
              if(err)
                console.log(err);
              else {
               // console.log("practical query 1", Result);
                student.dumpInsert(result, dumptable, enrollment_no, feedback.subject_code, feedback.instructor_code.toString(), function(err3, result3) {
                  if(err3) {
                    console.log(err3);
                    throw err3;
                  }

                  student.markStudentEntry(table3, semester, Number(enrollment_no), function(err4, res4) {
                    if(err4) {
                      console.log(err4);
                      throw err4;
                    }
                      console.log("theory feedback id " +feedback.feedbackId + ' of length '+ result.length +' updated ');
                  })
                })

              }
            })
              }

            callback();
            }, function(err) {
               if (err || hanu==1 ){
                console.error(err);
                res.status(err);
              }
              else{
                   nodemailer.createTestAccount((err, account) => {
                  var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: process.env.email,
                      pass: process.env.password,
                    }
                  });

                  var mailOptions = {
                    from: process.env.email,
                    to: req.session.student.email,   //Require user email at last as well
                    subject: 'Noreply@ffs',
                    text: 'Thank You For Your feedback. Your feedback has been recorded .'
                  };

                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                      res.send("400")
                    } else {
                      console.log('Email sent: ' + info.response);
                      res.send("200");
=======
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
>>>>>>> remotes/origin/Student_Data_Portal
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
    var course  = req.query.course;
    var stream  = req.query.stream;

    var year = 2017 - (semester + Number(process.env.odd_even))/2;
    console.log(year);


    var query = "select enrollment_no, name, s_" + semester + " from "  + collegeName + "_student_" + year + " where" +
     " course='" + course + "' AND stream='" + stream + "'";

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
    var year = 2017 - (semester + Number(process.env.odd_even))/2;

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
