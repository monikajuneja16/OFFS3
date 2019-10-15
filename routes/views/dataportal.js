var con = require("../../models/mysql"),
  ses = require("node-ses"),
  async = require("async"),
  controller = require("../../models/config"),
  nodemailer = require("nodemailer");

module.exports = {
  getTeacher: function(req, res) {
    var query = "select instructor_id,name,designation,school from employee";
    con.query(query, function(err, Employees) {
      if (err) {
        console.log(err);
      } else {
        res.json(Employees);
      }
    });
  },

  getCourse: function(req, res) {
    var college_name = req.query.college_name;

    var query = "select Distinct course from ??";
    con.query(query, [college_name + "_batch_allocation"], function(
      err,
      courseList
    ) {
      if (err) {
        console.log(err);
      }

      res.json(courseList);
    });
  },

  getStream: function(req, res) {
    var college_name = req.query.college_name;
    var course = req.query.course;

    var query = "select Distinct stream from ?? where course = ?";

    con.query(query, [college_name + "_batch_allocation", course], function(
      err,
      streamList
    ) {
      if (err) {
        console.log(err);
      }
      console.log(streamList);
      res.json(streamList);
    });
  },

  getSubjects: function(req, res) {
    console.log("Get Subjects");
    console.log(req.query);
    var college_name = req.query.college;
    var course = req.query.course;
    var stream = req.query.stream;
    var semester = req.query.semester;
    var query =
      "select subject_name, subject_code, type from ?? as t1 inner join ?? as t2 on t1.batch_id = t2.batch_id where " +
      " course = ? and stream = ? and semester = ?";
    console.log(query);
    con.query(
      query,
      [
        college_name + "_batch_allocation",
        college_name + "_subject_allocation_2018",
        course,
        stream,
        semester
      ],
      function(err, subjectList) {
        if (err) {
          console.log(err);
        }
        console.log(subjectList);
        res.json(subjectList);
      }
    );
  },

  createFeedback: function(req, res) {
    var spread=(...p)=>p;
    console.log("createFeedback");
    //console.log(req.query.data);
    var details = req.query;
    console.log(details);
    var Datas = details.data;
    if(typeof Datas=='string'){
      console.log("hit");
      Datas=spread(Datas);   
    }
    console.log(Datas);

    async.each(
      Datas,
      function(detail, callback) {
        console.log("*");
        console.log(detail);
        detail=JSON.parse(detail);
        
        if (detail.teacher_name) {
          //console.log(typeof detail.teacher_name);
          //console.log(typeof detail);
          var teacherName = detail.teacher_name.toString();
          //console.log(typeof teacherName);
          var temp = teacherName.split(" ");
          //console.log(temp);
          var school = details.college;
          var course = details.course;
          var stream = details.stream;
          var semester = details.semester;
          var teacherId = temp[temp.length - 1];
          var subjectId = detail.subject_code;
          var subjectName = detail.subject_name;
          var type = detail.type;
          console.log(temp);
          console.log(school);
          console.log(course);
          console.log(stream);
          console.log(semester);
          console.log(teacherId);
          console.log(subjectId);
          console.log(subjectName);
          console.log(type);
          var subjectAllocationTable =
            school + "_subject_allocation_" + `${process.env.year}`;
          var batchAllocatiomTable = school + "_batch_allocation";
          var feedbackTable = school + "_feedback_" + `${process.env.year}`;
          var getBatch =
            "select batch_id from " +
            batchAllocatiomTable +
            " where course=? and stream=? and semester = ?";
          var insertSA =
            "INSERT INTO " +
            subjectAllocationTable +
            " (`feedback_id`, `batch_id`,`subject_code`, `instructor_code`, `subject_name`, `type`) VALUES" +
            " (null, ?, ?, ?, ?, ? );";
          var insertF =
            "INSERT INTO " +
            feedbackTable +
            ' (`feedback_id`, `instructor_id`, `subject_code`, `type`, `total`, `at_1`, `at_2`, `at_3`, `at_4`, `at_5`, `at_6`, `at_7`, `at_8`, `at_9`, `at_10`, `at_11`, `at_12`, `at_13`, `at_14`, `at_15`, `no_of_students_evaluated`) VALUES (?, ?,"","",0,"0","0","0","0","0","0","0","0","0","0","0","0","0","0","0",0)';
          console.log(getBatch);
          console.log("****************************************************");
          con.query(getBatch, [course, stream, semester], function(
            err,
            batchId
          ) {
            if (err) {
              console.log(err);
            } else {
              console.log("insertion happening");
              console.log(batchId);
              console.log(insertSA);
              console.log(
                "****************************************************"
              );
              con.query(
                insertSA,
                [batchId[0].batch_id, subjectId, teacherId, subjectName, type],
                function(err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(result.insertId); //Feedback Id
                    console.log(insertF);
                    console.log(
                      "****************************************************"
                    );
                    con.query(insertF, [result.insertId, teacherId], function(
                      err,
                      res
                    ) {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log("Feedback table");
                        console.log(res);
                      }
                    });
                  }
                }
              );
            }
          });
        }
        callback();
      },
      function(error, Result) {
        if (error) {
          console.log(error);
          var obj = {
            status: 400,
            message: "Something went wrong!! Please try again"
          };
        } else {
          console.log("Data recorded");
          var obj = { status: 200, message: "Your data is recorded" };
          console.log(obj);
          res.json(obj);
        }
      }
    );
  }
};
