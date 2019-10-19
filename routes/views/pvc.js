var con = require('../../models/mysql'),
	ses = require('node-ses'),
	async = require('async'),
	controller = require('../../models/config'),
	nodemailer = require('nodemailer'),
	multer=require('multer');

module.exports = {
	index: function(req, res) {},

	upload_photo: function(req, res) {
        
         console.log("in upload section");
          var storage = multer.diskStorage({
           destination: function (req, file, cb) {
           	console.log("destination");
          cb(null, './facultyFrontend/app/instructor_images/pro_vc/')
          },
          filename: function (req, file, cb) {
          cb(null, 'pro_vc.jpg')
         }
       });

        var upload = multer({ 
        	fileFilter: function (req, file, cb) {
        		console.log("check");

                  var filetypes = /jpeg|jpg/;
                  var mimetype = filetypes.test(file.mimetype);
                  var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

                         if (mimetype && extname) {
                             return cb(null, true);
                         }else{
                   cb("Error: File upload only supports the following filetypes - " + filetypes);
                    console.log("nvalidate");}
             }, storage: storage }).single('photo');

         upload(req, res, function (err) {
            if(err) {
              console.log(err);
              var obj = { status: 400, message: "Image can't be uploaded" };
                    res.json(obj);
            }
            else{
            	
             console.log("Image uploaded");
             var obj = { status: 200, message: "Image uploaded successfully" };
             res.json(obj);
            }
        })    
    },

	initials: function(req, res) {
		console.log('pvc initials');
		console.log(req.query);
		var college_name = req.query.college_name;
		var pvc_id = req.query.pvc_id;
		var password = req.query.password;
		var query = 'select * from employee where instructor_id = ? and password = ? and designation="pro vc"';
		console.log(college_name, pvc_id, password);
		if (college_name != null && pvc_id != null && password != null) {
			//Check For all fields
			con.query(query, [pvc_id, password], function(error, result) {
				if (error) {
					console.log(error);
					var obj = { status: 400, message: 'There is error in query!' };
					res.json(obj);
				} else if (result[0] == null) {
					var obj = { status: 400, message: 'Wrong credentials entered for Pro Vice Chancellor' };
					res.json(obj); // Invalid Password or username
				} else {
					req.session.pvc = result[0];
					req.session.pvc.college_name = req.query.college_name;
					var obj = { status: 200, message: 'pvc authentication Successfull' };
					console.log(req.session);
					res.json(obj); //Successfull
				}
			});
		} else {
			console.log('Not All Fields Set');
			var obj = { status: 400, message: 'Not All Fields Set' };
			res.json(obj);
		}
	},

	updatePvcInfo   :   function(req,res){
		var {name,email,phone,date_of_joining,designation,room_no,school,instructor_id}=req.body.pvcInfo;
		var wrong_info="";

		if(name==undefined || name==""){wrong_info+=", Name";}
		if(email==undefined ||email==""){wrong_info+=", Email";} 
		if(phone==undefined || phone==0){wrong_info+=", Phone";} 
		if(date_of_joining==undefined || date_of_joining=="" || date_of_joining=="0000-00-00"){wrong_info+=", Date of Joining";}
		if(designation==undefined){wrong_info+=", Designation";}
		if(room_no==undefined || room_no==""){wrong_info+=", Room Number";}
		if(instructor_id==undefined){wrong_info+="Instructor Id"}
		
		if(wrong_info.length>2){
			        console.log(wrong_info);
					console.log("Wrong PVC information");
					res.status(400).json({'message' : 'Please provide valid input for'+wrong_info.substr(1)+' to record information. Please hover over the input fields to check for format of information.'});
					return;
		}
		console.log(name+" - "+email+" - "+phone+" - "+date_of_joining+" - "+designation+" - "+room_no+" - "+school+" - "+instructor_id);
		var query="update ?? set name=?,email=?,phone=?,date_of_joining=?,designation=?,room_no=?,school=? where instructor_id=?"
		con.query(query,['employee',name,email,phone,date_of_joining,designation,room_no,school,instructor_id],
			function(err,done){
				if(err){console.log(err);return;}
				else if(done){
				console.log("pvc information updated");
				res.status(200).json({'message':'Pro Vice Chancellor Information Updated'});
				}
		})
	},

logout: function(req, res) {
    console.log("logout")
    if (req.session.pvc) {
         req.session.destroy();
         var obj={status:200,message:"Logged Out"};
         console.log(obj);
         res.json(obj);
     } else{
      console.log("No session detected");
      var obj = { status: 200, message: "No session detected" };
    }
  },

	checksession: function(req, res) {
		/*  This route is just to check if sessions are working .
			Hit this url once you have logged in.	*/
			console.log(req.session + "******************");
		if (req.session.pvc) {
			console.log(req.session.pvc);
			res.json(req.session.pvc);
		} else {
			console.log('No session detected');
			var obj = { status: 200, message: 'No session detected' };
		}
	},
	dashboard: function(req, res) {
		console.log('In dashboard');
		let colleges=['usap','usbas','usbt','usct','use','usem','ushss','usict','uslls','usmc','usms'];
		
		var year = req.query.year;
		var school_name = req.query.college_name;
		var finalQuery,insArr=[];
	
		if (year == null || school_name == null) {
			console.log(year);
			console.log(school_name);
			var obj = { status: 400, message: 'Not All Fields Set' };
			res.json(obj);
		} else {
		
		finalQuery=colleges.map(college_name=>{
		
			var tables = {
				batch_allocation: college_name + '_batch_allocation',
				subject_allocation: college_name + '_subject_allocation_' + year,
				feedback: college_name + '_feedback_' + year,
				employee: 'employee',
			};

			//console.log(tables);
var fin = `s.feedback_id,
s.batch_id,
s.subject_code,
s.instructor_code,
s.subject_name,
s.type,
b.batch_id,
b.course,
b.stream,
b.semester,
e.instructor_id,
e.name,
e.email,
e.phone,
e.date_of_joining,
e.password,
e.designation,
e.room_no,
e.school,
f.feedback_id,
f.instructor_id,
f.total,
f.at_1,
f.at_2,
f.at_3,
f.at_4,
f.at_5,
f.at_6,
f.at_7,
f.at_8,
f.at_9,
f.at_10,
f.at_11,
f.at_12,
f.at_13,
f.at_14,
f.at_15,
f.no_of_students_evaluated`;
			var query =
				' select '+fin+' from ' +
				tables.subject_allocation +
				' as s  ' +
				' inner join  ' +
				tables.batch_allocation +
				' as b on s.batch_id = b.batch_id ' +
				' inner join  ' +
				tables.employee +
				' as e on s.instructor_code =e.instructor_id ' +
				' inner join  ' +
				tables.feedback +
				' as f on s.feedback_id = f.feedback_id where e.school=? and no_of_students_evaluated != 0';
			//console.log(query);
			insArr.push(school_name);
			return query;
		})
			finalQuery=finalQuery.join(" union ");
			con.query(finalQuery,insArr, function(error, result) {
				if (error) {
					console.log(error);
					var obj = { message: 'Feedback not recorded for this year!' };
					res.status(400).json(obj); // Connection Error
					return;
				} else if (result[0] == null) {
					console.log('No pvc Found');
					var obj = { status: 400, message: 'No Such User Found ! .' };
					res.json(obj); // Invalid Password or username
				} else {
					console.log('Data fetched');
					console.log(result);
					res.json(result);
				}
			});
		}
	},
};
