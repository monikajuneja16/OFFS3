var con = require("../../models/mysql");
var crypto = require("crypto");
var mailer = require("nodemailer");

module.exports = {
  reset: function(req, res) {
    console.log("hit /resetPassword/otp");
    //console.log(req.body);
    var token = req.body.resetVar;
    //token.slice(0,-3);
    //console.log(token);
    var newPassword = req.body.password;
    var instructorId = req.body.instructor_id; 
    con.query("SELECT * FROM employee WHERE instructor_id=?", [instructorId], function(
      err,
      result
    ) {

      console.log("actual OTP : "+result[0].resetVar);
      
     /* console.log(`${result[0].resetVar.slice(0,3)}  +  ${token.slice(-4,-1)}`);
      console.log(`${result[0].resetVar.slice(-4,-1)}  +  ${token.slice(0,3)}`);
    */
      resetVar=result[0].resetVar;

      if (resetVar.slice(0,3)== token.slice(token.length-3) && resetVar.slice(resetVar.length-3)== token.slice(0,3)) {
        //console.log("Time now : "+Date.now()+"\n recorded time : "+result[0].resetVarExpires);
        if (result[0].resetVarExpires > Date.now()) {

          con.query(
            "UPDATE employee SET resetVar='test',password=? instructor_id=?",
            [newPassword, instructorId],
            function(error, complete) {
              //res.send("Password has been reset");
              res.json({
                response: 'reset'
              });
            }
          );
        } else {
          //res.send("LINK HAS EXPIRED");
          res.json({
            response: 'expire'
          });
        }
      } else {
        //res.send("WRONG OTP");
        res.json({
          response: 'wrongOTP'
        });
      }
    });
  },
  resetRequest: function(req, res) {
    var email = process.env.email.split("/");
    var pass = process.env.password.split("/");
    var mailNo = process.env.mailNo;
    console.log(email[mailNo]);
    console.log(pass[mailNo]);
    
    var instructorId = req.body.instructor_id;
    console.log("hit /resetPassword")
    con.query(
      "SELECT * FROM employee WHERE instructor_id=?",
      [instructorId],
      function(err, result) {
        if (err) {
          //res.send("SERVER FAILURE");
          res.json({
            response: 'serverFailure'
          });
        } else {
          if (result.length != 0) {
              crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString("hex");
                var otp=token.slice(token.length-3,token.length)+token.slice(0,3);
                console.log(otp);
                var expire = Date.now() + 3600000;
                /*console.log("now : "+Date.now());
                console.log("expire : "+expire);*/
                console.log("reached query");
                con.query(
                  "UPDATE employee SET resetVar=?,resetVarExpires=? WHERE instructor_id=?",
                  [token, expire, instructorId],
                  function(error, complete) {
                    console.log("mail starts");
                    mailer.createTestAccount((err, account) => {
                      var transporter = mailer.createTransport({
                        service: "gmail",
                        auth: {
                          user: email[mailNo],
                          pass: pass[mailNo]
                        }
                      });

                      var mailOptions = {
                        from: email[mailNo],
                        to: result[0].email,
                        subject: "PasswordReset@FacultyFeedbackSystem",
                        text:
                          "Hi, Here is your Reset Password OTP [CAUTION: It will expire in 1 hour]  ->  " +
                          otp + "  If you did not request this, kindly ignore this mail."
                      };

                      transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                          console.log(error);
                          res.json({
                            response:'error'
                          })
                        } else {
                          console.log("mail shooted");
                          console.log("Email sent: " + info.response);
                          //res.send("200");
                          res.status(200).json({
                            response: 'sentMail'
                          });
                        }
                      });
                    });
                  }
                );
              });
          }
        }
      }
    );
  }
};
