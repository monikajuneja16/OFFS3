var con = require("../../models/mysql");

module.exports = {
  getSubjectStatus: function(req, res) {
    var payload = {};
    let college = req.query.college;
    var odd_even = -1;
    if (process.env.odd_even == 1 ) {
      odd_even = 1;
    }
    else if (process.env.odd_even == 2 ) {
      odd_even = 0;
    }
    //Check if subject allocation 2018 even exists
    var initQuery = "SHOW TABLES LIKE ?";
    con.query(
      initQuery,
      [college + "_subject_allocation_" + process.env.year],
      function(err, List) {
        if (err) {
          console.log(err);
          res.status(500).send("SERVER FAILURE");
        } else {
          if (List.length != 0) {
            // That means the tables exists s we will query further

            var queryNoData =
              "SELECT DISTINCT a.batch_id,a.course,a.stream,a.semester " +
              "FROM " +
              "?? as a " +
              "left join ?? as b " +
              "on b.batch_id = a.batch_id " +
              "where b.instructor_code is null and semester%2 = "+odd_even+";";
            con.query(
              queryNoData,
              [
                college + "_batch_allocation",
                college + "_subject_allocation_"+process.env.year
              ],
              function(err, List) {
                if (err) {
                  console.log(err);
                  res.status(500).send("SERVER FAILURE");
                } else {
                  //inserted into payload under noData
                  payload.noData = List;
                  //query to return batch information whose teacher data portal is filled
                  var queryData =
                    "SELECT DISTINCT b.batch_id ,b.course,b.semester,b.stream " +
                    "FROM " +
                    "?? as a " +
                    "left join ?? as b " +
                    "on b.batch_id = a.batch_id " +
                    "where b.semester % 2 = "+odd_even +" "+
                    "order by batch_id asc;";
                  con.query(
                    queryData,
                    [
                      college + "_subject_allocation_" + process.env.year,
                      college + "_batch_allocation"
                    ],
                    function(err, List) {
                      if (err) {
                        console.log(err);
                        res.status(500).send("SERVER FAILURE");
                      } else {
                        //inserted into payload under data
                        payload.data = List;
                        //payload returned jsonified
                        res.status(200).json(payload);
                      }
                    }
                  );
                }
              }
            );
          } else {
            var noDataQuery = "SELECT * FROM ?? where semester % 2 = "+odd_even+";";
            con.query(noDataQuery, [college + "_batch_allocation"], function(
              err,
              List
            ) {
              if (err) {
                console.log(err);
                res.status(500).send("SERVER FAILURE");
              } else {
                payload.noData = List;
                payload.data = [];
                res.status(200).json(payload);
              }
            });
          }
        }
      }
    );
  }
};
