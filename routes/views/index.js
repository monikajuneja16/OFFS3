var con         = require("../../models/mysql"),
    ses         = require('node-ses'),
    async       = require('async'),
    controller  = require("../../models/config"),
    nodemailer  = require('nodemailer'),
    student     = require('../../models/student'),
     smtpTransport = require('nodemailer-smtp-transport'),
  handlebars = require('handlebars'),
     fs = require('fs');

     

//  year=18;
module.exports = {

  index: function (req, res) {

  },
  initials:function(req,res) {
    console.log("Hit initials");
    console.log(req.query);

    if(req.query.college_name==null||req.query.enrollment_no==null||req.query.email==null||req.query.type==null||req.query.semester==null) {
      console.log("Not all Fields Set");
      res.status(400);
      return;

    }

    var type          = req.query.type;
    var semester      = req.query.semester;
    var year          = process.env.year - (req.query.semester - process.env.odd_even)/2;
    var masters_year  = Number('20'+req.query.enrollment_no.slice(req.query.enrollment_no.length-2));
    if(masters_year==year-4 || masters_year==year-5){
          year=masters_year;
    };
    console.log("Year is : "+year);
    //year              = (Math.floor(year)).toString();
    var college_name  = req.query.college_name;
    var tablename     = college_name + '_' + type + '_' + year;
    var random        = Math.floor(Math.random()*(98989 - 12345 + 1) + 12345 );
    var email         = req.query.email.toString();
    var password      = random;
    //if(Number(req.query.enrollment_no.slice(req.query.enrollment_no.length-2))
    var enrollment_no = Number(req.query.enrollment_no);


    console.log(process.env.year);
    console.log(req.query.semester);
    console.log(process.env.odd_even);
    console.log(year);


    student.checkLogin(college_name, year, semester, enrollment_no, function(er3, res3) {
      if(er3) {
        console.log(er3);
        return ;
      }

      if(res3[0]==undefined){
        res.json({"message":"No information exists for the student with entered enrollment number in the selected school."});
        return;
      }
      //console.log(res3);
      if(res3[0]['s_' + semester]=='1') {
        console.log(res3[0]['s_' + semester]);
        var obj = {'message' : "You have already filled your feedback, Thanks!"}
        console.log("user found in dump");
        res.send(obj);

      } else {
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
              console.log('EMAIL');
              var email=process.env.email.split('/');
              var pass=process.env.password.split('/');
              var mailNo=process.env.mailNo;         
		console.log(email[mailNo]);
		console.log(pass[mailNo]);
                
               nodemailer.createTestAccount((err, account) => {
                 var transporter = nodemailer.createTransport({
                   service:'gmail',
                   auth: {
                     user:email[mailNo],
                     pass: pass[mailNo],
                   }
                 });

                 var mailOptions = {
                   from: email[mailNo],
                   to: req.query.email,
                   subject: 'Noreply@FacultyFeedbackSystem',
                   text: 'Hi, Please Use this OTP : ' +random
                 };

                 transporter.sendMail(mailOptions, function(error, info) {
                   if (error) {
                     console.log(error);
                   } else {
                     console.log('Email sent: ' + info.response);
                     res.send("200");
                   }
                 });
               });

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
    var masters_year  = Number('20'+req.query.enrollment_no.slice(req.query.enrollment_no.length-2));
    if((masters_year==year-4 || masters_year==year-5)){
          year=masters_year;
    };
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
          res.json({"err":"wrongpass"})
          return;
          
        } else {
          console.log(result[0]);
          var temp=tablename.split("_");

          // for USICT students' entries in M. TECH course transformed from B. TECH issue
          if((result[0].year_of_admission==Number(process.env.year)-4 || 
            result[0].year_of_admission==Number(process.env.year)-5) && result[0].course=="B. TECH"){     
               con         
              result[0].course='M. TECH';    
              student.updateInformation(tablename,enrollment_no,"M. TECH",function(err){
              if(err){throw err;}
              
            });
          
         }
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
          console.log("Student info : "+JSON.stringify(req.session.student,undefined,2));
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
  logout: function(req, res) {
    console.log("logout");
    if (req.session.student) {
         req.session.destroy();
         var obj={status:200,message:"Logged Out"};
         console.log(obj);
         res.json(obj);
     } else{
      console.log("No session detected");
      var obj = { status: 200, message: "No session detected" };
    }
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


//--------------------------feedback------------------------------//

  feedbackform : function(req,res) {
      console.log("Hit Feedback Form");
      //console.log(req.session.student);

      if(req.session.student.course && req.session.student.stream && req.session.student.year && req.session.student.college_name) {
          console.log(req.session.student);
          var college_name  = req.session.student.college_name;

          var tablename1    = college_name + '_subject_allocation_'+process.env.year  ;  //Changes Every Year
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
      var tablename = req.session.student.college_name +"_feedback_"+process.env.year ; //Changes Every Year
      //console.log("feedback year : "+req.session.year);
      var feedbacks = req.body.teacherFeedback;
      console.log("Feedback object : " + feedbacks)
      //console.log("Feed backs : "+feedbacks);
      
      var year =req.session.student.year_of_admission;
      var dumptable = req.session.student.college_name + '_dump_'+process.env.year ;
      var enrollment_no = req.session.student.enrollment_no.toString();
      var semester  = req.session.student.semester;
      var table3 = req.session.student.college_name + '_student_' + year;
      console.log(enrollment_no);

      //------------------semester ----------------------//
      console.log("Semester : "+semester);
      //var hanu =0;
      console.log("Feedback score  : ");
      if(req.session.student.college_name==null||feedbacks.length==0||req.session.student.enrollment_no==null) {
        console.log("Not All Fields set");
        res.status(400).json({'message':'Empty feedback found. Please provide the feedbacks again'});
        return;

      } else {
            var error=0;
            async.each(feedbacks,function(feedback,callback) {
            hanu =0;
            //console.log("Feedbacks of teacher : "+ feedback);
            var result = feedback.score;
            console.log("Result : "+result.length);
            var attr_len=result.length;
            if(attr_len==15 && feedback.feedbackId!=null) {

              
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

          //to be set

            var query2 =   'insert into ' + dumptable +' (enrollment_no,student_name,course,stream,semester,subject_code,subject_name,type,instructor_id,instructor_name,attribute_1,attribute_2,'+
          'attribute_3,attribute_4,attribute_5,attribute_6,attribute_7,attribute_8,attribute_9,'+
          'attribute_10,attribute_11,attribute_12,attribute_13,attribute_14,attribute_15) '+
          'values ( ' + req.session.student.enrollment_no +',\'\',\'\',\'\',? , ? ,\'\',\'\', ? ,\'\','+
           result[0]+','+ result[1]+','+ result[2]+','+ result[3]+','+result[4] +','+result[5] +
          ','+ result[6]+','+result[7] +','+result[8] +','+result[9] +','+result[10] +','+result[11] +','+result[12] +','+
           result[13]+','+ result[14]+')';
          // console.log(query2);

          //total student calculation
            var sum=0;
            


          for(i=0;i<attr_len;i++) {
            result[i]=Math.round(Number(result[i]));

            if(result[i]>5&&result[i]<1) {
              console.log("Incorrect Data");
              res.send("400");

            } else {
              sum=sum+Number(result[i]);

            }
          };

            var theory=[result[0],result[1],result[2],result[3],result[4],result[5],
                        result[6],result[7],result[8],result[9],result[10],result[11],
                        result[12],result[13],result[14],sum];
            


            console.log("results : "+result);
            con.query(query,theory,function(err,Result){
              if(err)
                console.log(err);
              else{

                //console.log("query1",Result);
                con.query(query2,[semester,feedback.subject_code,feedback.instructor_code.toString()],function(err3,result3){
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
                        console.log("user feedback recorded set true");
                      }

                    })

                  }
                })

              }
            })


              }
              else if(attr_len==8 &&feedback.feedbackId!=null)
              {
                var query='update '+ tablename+' set'+
                   ' at_1 = concat(at_1,?),  at_2 = concat(at_2,?),  at_3 = concat(at_3,?), '  +
                   ' at_4 = concat(at_4,?),  at_5 = concat(at_5,?),  at_6 = concat(at_6,?), '  +
                   ' at_7 = concat(at_7,?),  at_8 = concat(at_8,?), '+
                   ' no_of_students_evaluated =  no_of_students_evaluated + 1 ,'+
                   ' total = total + ? ' +
                      'where feedback_id = ' +feedback.feedbackId;
               // console.log("nothing");
             var query2 =   'insert into ' + dumptable +' (enrollment_no,student_name,course,stream,semester,subject_code,subject_name,type,instructor_id,instructor_name,attribute_1,attribute_2,'+
          'attribute_3,attribute_4,attribute_5,attribute_6,attribute_7,attribute_8) '+
          'values ( ' + req.session.student.enrollment_no +',\'\',\'\',\'\',? , ? ,\'\',\'\', ? ,\'\','+
           result[0]+','+ result[1]+','+ result[2]+','+ result[3]+','+result[4] +','+result[5] +
          ','+ result[6]+','+result[7] + ')';

                // console.log(query2);

                // console.log("Something");

            var sum=0;
            for(i=0;i<attr_len;i++)    //check;
            {   result[i]=Math.round(Number(result[i]));
              if(result[i]>5&&result[i]<1)
              {
                //res.send("Incorrect Data");
              } else {
                sum=sum+Number(result[i]);
              }
            };
            //coo

            var practical=[result[0],result[1],result[2],result[3],result[4],result[5],result[6],result[7],sum];

            con.query(query,practical,function(err,Result){
              if(err)
                console.log(err);
              else {
               // console.log("practical query 1", Result);
               console.log("insertion in feedback table");
                student.dumpInsert(result, dumptable, enrollment_no,semester, feedback.subject_code, feedback.instructor_code.toString(), function(err3, result3) {
                  if(err3) {
                    console.log(err3);
                    throw err3;
                  }
                  console.log("insertion in dump table");
                  student.markStudentEntry(table3, semester, Number(enrollment_no), function(err4, res4) {
                    if(err4) {
                      console.log(err4);
                      throw err4;
                    }
                    console.log("student entry marked");
                      console.log("theory feedback id " +feedback.feedbackId + ' of length '+ result.length +' updated ');
                  })
                })

              }
            })
              }/*else if(attr_len!=0 &&feedback.feedbackId!=null){
                console.log("Feedback not recorded");
                res.status(400).json({'message':'Feedback not recorded. Please fill all the fields again.'});
                return;
              }*/

            callback();
            }, function(err) {
               if (err){
                console.error(err);
                res.status(err);
              }
              else{
                var email=process.env.email.split('/');
                var pass=process.env.password.split('/');
                var mailNo=process.env.mailNo;
                  console.log(email[mailNo]);
                  console.log(pass[mailNo]);
                  /*nodemailer.createTestAccount((err, account) => {
                  var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: email[mailNo],
                      pass: pass[mailNo],
                    }
                  });
                 
                  var mailOptions = {
                    from: email[mailNo],
                    to: req.session.student.email,   //Require user email at last as well
                    subject: 'Noreply@ffs',
                    html: '<h1>ThankYou For Your feedback</h1><br><b>Your feedback has been recorded anonymously.</b><br><br> you can confirm it at 142.93.210.160/#/status'
                  };

                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                      res.send("400")
                    } else {
                      process.env.mailNo=Number(process.env.mailNo)+1;
                      if(process.env.mailNo==email.length){process.env.mailNo=0;}
                      console.log('Email sent: ' + info.response);
                      res.send("200");
                    }
                  });

                  });*/
                
                 var readHTMLFile = function(path, callback) {
                      fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                          if (err) {
                              throw err;
                              callback(err);
                          }
                          else {
                              callback(null, html);
                          }
                      });
                  };

               nodemailer.createTestAccount((err, account) => {
                  var transporter = nodemailer.createTransport({
                    service:'gmail',
                    auth: {
                      user: email[mailNo],
                      pass: pass[mailNo],
                    }
                  });

                  readHTMLFile('./facultyFrontend/app/templates/feedback_email.html', function(err, html) {
                      var template = handlebars.compile(html);
                      var replacements = {
                           username: req.session.student.name,
                           link:process.env.link
                      };
                      var htmlToSend = template(replacements);
                      var mailOptions = {
                         from: process.env.email,
                         to: req.session.student.email,   //Require user email at last as well
                         subject: 'Noreply@ffs',
                          html : htmlToSend
                       };
                       transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                      res.status(400).json({'message':'Email not sent'});
                    } else {
                      process.env.mailNo=Number(process.env.mailNo)+1;
                      if(process.env.mailNo==email.length){process.env.mailNo=0;}
                      console.log('Email sent: ' + info.response);
                      res.status(200).json({'message':'Student Feedback recorded'});
                    }
                      });
                  });
              });
                  console.log("Thanks for the feedback")
              }

            })

        }
    },


  getStudentStatus: function(req, res) {

    var collegeName = req.query.collegeName;
    var semester = parseInt(req.query.semester);
    var course  = req.query.course;
    var stream  = req.query.stream;
    var year = req.query.year;
    var result;

    //  = process.env.year - (semester - process.env.odd_even)/2;
    // var masters_year  = Number('20'+(year-2000))-4;
    


    var query = "select enrollment_no, name, s_" + semester + " from "  + collegeName + "_student_" + year + " where" +
     " course='" + course + "' AND stream='" + stream + "'";

    console.log(query);

    con.query(query, function(err, userStatus) {
      if (err) {
        console.log(err);
        res.json("400");

        return;
      }

      
      result=userStatus;
      console.log(result);
      res.json(result);
      return; 
    //   if(course=="M. TECH"){
    //     year=masters_year;
    //     var query = "select enrollment_no, name, s_" + semester + " from "  + collegeName + "_student_" + year + " where" +
    //  " course='" + course + "' AND stream='" + stream + "'";

    //     console.log(query);
    //     con.query(query, function(err, userst) {
    //       if (err) {
    //         console.log(err);
    //         res.json("400");
    //         return;
    //       }
    //       console.log(userst);
    //       userst.forEach(function(val){
    //         result.push(val);           
    //       });
    //       console.log(result);
    //       res.json(result);
    //       return;
    //   });
    // }else{

    //     res.json(result);
    //     return; 
        
    //   }
    })
  },

  getStudentDetails: function(req, res) {

    var collegeName = req.query.collegeName;
    var semester = parseInt(req.query.semester);
    var year = process.env.year - (semester - process.env.odd_even)/2;

    var userDetails = {
      stream:[],
      course:[]
    }

    if (process.env.year) {
      var query = "select distinct stream from " + collegeName + "_student_" + year;
    }

    console.log(query);
    con.query(query, function(err, stream) {
      if (err) {
        console.error(err);
        res.json("400");
        return;
      }
      userDetails.stream = stream;

      var query2 = "select distinct course from " + collegeName + "_student_" + year;
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
      })
    })
 },




 studentData: function(req, res) {

 
  console.log(req.query);

  var spread=(...p)=>p;
  
  var students=req.query.data;
  if(typeof students=='string'){
    console.log("hit");
    students=spread(students);   
  }
  var enrNo=JSON.parse(students[0]).enrollment_no;
  var admYr="20"+enrNo.slice(enrNo.length-2);
  //var year= process.env.year - ( - process.env.odd_even)/2;
  var college_name = req.query.college;
  var course = req.query.course;
  var stream = req.query.stream;

  

  if (process.env.year) {
    var tableName = `${college_name}_student_${admYr}`;
    var initQuery =
      "CREATE TABLE IF NOT EXISTS ?? (`enrollment_no` bigint(20) primary key,`name` varchar(100) NOT NULL,`email` varchar(100) DEFAULT NULL,`phone` varchar(100) DEFAULT NULL,`year_of_admission` int(4) NOT NULL,`password` varchar(600) DEFAULT NULL,`course` varchar(100) NOT NULL,`stream` varchar(100) NOT NULL,`s_1` int(11) DEFAULT '0',`s_9` int(11) DEFAULT '0',`s_8` int(11) DEFAULT '0',`s_5` int(11) DEFAULT '0',`s_6` int(11) DEFAULT '0',`s_4` int(11) DEFAULT '0',`s_3` int(11) DEFAULT '0',`s_2` int(11) DEFAULT '0',`s_7` int(11) DEFAULT '0',`s_10` int(11) DEFAULT '0') ENGINE=InnoDB DEFAULT CHARSET=latin1;";
    con.query(initQuery, [tableName], err => {
      if (err) {
        res.status(500).send(
          JSON.stringify({
            err,
            dataInserted: false,
            message: "Init Query Failed"
          })
        );
      }else{

        
      
        async.each(students,(singleStudent, callback) => {
          // console.log("Student : "+singleStudent)
             
          
             var student = JSON.parse(singleStudent);
             // console.log(student.enrollment_no, typeof student);
     
             var query =
               "INSERT INTO ?? (`enrollment_no`, `name`, `email`, `phone`, `year_of_admission`, `password`, `course`, `stream`, `s_1`, `s_9`, `s_8`, `s_5`, `s_6`, `s_4`, `s_3`, `s_2`, `s_7`, `s_10`) VALUES " +
               "(?,?,?,?,?,0000,?,?, 0 ,0,0,0,0,0,0,0,0,0)";
     
             var query2=""
             con.query(
               query,
               [
                 tableName, 
                 student.enrollment_no,
                 student.name,
                 student.email,
                 student.phone,
                 Number(admYr),
                 course,
                 stream
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
      }
    });
    // console.log(req.query.data, typeof req.query.data);
    // var data = JSON.parse(req.query.data);

    // console.log(req.query.data, typeof req.query.data);
    
  } else {
    res.status(500).send("Server Down");
  }
}

}

//Commit
