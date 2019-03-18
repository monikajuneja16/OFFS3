var con = require('../../models/mysql'),
	ses = require('node-ses'),
	async = require('async'),
	controller = require('../../models/config'),
    multer=require('multer');

module.exports = {
	/**
	 * [index description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	index: function(req, res) {},

	getTeacherData:function(req,res){
		var {school,designation}=req.query;
		designation=designation.toLowerCase();
		console.log("Returning teachers");
		if(designation=='dean' || designation=="pro vc" || designation=="vc"){
				con.query("SELECT name,instructor_id from ?? where school=? and designation=? order by name",
							['employee',school,designation],(err,resp)=>{
								if(err){
									res.status(400).json({'message':'Server failure'});
									return;
								}
								res.status(200).json(resp);
							});
		}else{
				con.query("SELECT name,instructor_id from ?? where school=? order by name",
							['employee',school],(err,resp)=>{
								if(err){
									res.status(400).json({'message':'Server failure'});
									return;
								}
								res.status(200).json(resp);
							});
		}
	},

	/**
	 * [initials description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	initials: function(req, res) {
		console.log('To authenticate teacher');
		console.log("Inside the params :-");
		console.log(req.query);
		var college_name = req.query.college_name;
		var ins_id = req.query.ins_id;
		var password = req.query.password;

		var query = 'select * from ' + 'employee where instructor_id = ? and password = ?';
		console.log(query);
		console.log(college_name, ins_id, password);

		if (college_name != null && ins_id != null && password != null) {
			//Check For all fields
			con.query(query, [ins_id, password], function(error, result) {
				console.log("Query Result :- ");

				console.log(result);

				if (error) {
					console.log(error);
					var obj = { status: 400, message: 'There is error in query!' };
					res.json(obj);
				} else if (result[0] == null) {
					console.log("No Teacher Found")
					var obj = { status: 400, message: 'Wrong credentials entered. Kindly select name from the dropdown and enter correct password. Please contact us at sdcusict@ipu.ac.in if you still face any issues.' };
					res.json(obj); // Invalid Password or username
				} else {
					req.session.ins = result[0];
					//req.session.ins.college_name = req.query.college_name;
					console.log("Teacher Found");
					console.log("session Created");
					console.log(req.session.ins);
					var obj = { status: 200, message: 'Teacher authentication Successfull' ,teacher:result[0] };
					res.json(obj); //Successfull
				}
			});
		} else {
			console.log('Not All Fields Set');
			var obj = { status: 400, message: 'Not All Fields Set' };
			res.json(obj);
		}
	},

	/**
	 * [checksession description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	checksession: function(req, res) {
		/*  This route is just to check if sessions are working .
			Hit this url once you have logged in.	*/
			console.log("Check for hit");
			console.log(req.query);
			console.log(req.body);

		if (req.session.ins) {
			con.query('SELECT * FROM ?? where instructor_id=? and password=?',
						['employee',req.session.ins.instructor_id,req.session.ins.password],function(err,resp){
							if(resp){
								req.session.ins=resp[0];
								res.json(req.session.ins);
							}else if(err){
								console.log("No session detected");
							}
						})
			
		} else {
			console.log('No session detected');
			var obj = { status: 200, message: 'No session detected' };
		}
	},
    logout: function(req, res) {
    console.log("logout")
    if (req.session.ins) {
         req.session.destroy();
         var obj={status:200,message:"Logged Out"};
         console.log(obj);
         res.json(obj);
     } else{
      console.log("No session detected");
      var obj = { status: 200, message: "No session detected" };
    }
  },

  	updateTeacherInfo   :   function(req,res){
		var {name,email,phone,date_of_joining,designation,room_no,school,instructor_id}=req.body.teacherInfo;
		var wrong_info="";

		if(name==undefined || name==""){wrong_info+=", Name";}
		if(email==undefined ||email==""){wrong_info+=", Email";} 
		if(phone==undefined || phone==0){wrong_info+=", Phone";} 
		if(date_of_joining==undefined || date_of_joining=="" || date_of_joining=="0000-00-00"){wrong_info+=", Date of Joining";}
		if(designation==undefined){wrong_info+=", Designation";}
		if(room_no==undefined || room_no==""){wrong_info+=", Room Number";}
		if(school==undefined || school==""){wrong_info+=", USS";}
		if(instructor_id==undefined){wrong_info+="Instructor Id"}
		
		if(wrong_info.length>2){
					console.log("Wrong teacher information");
					res.status(400).json({'message' : 'Please provide valid input for '+wrong_info.substr(1)+' to record information. Please hover over the input fields to check for format of information.'});
					return;
		}
		console.log(name+" - "+email+" - "+phone+" - "+date_of_joining+" - "+designation+" - "+room_no+" - "+school+" - "+instructor_id);
		var query="update ?? set name=?,email=?,phone=?,date_of_joining=?,designation=?,room_no=?,school=? where instructor_id=?"
		con.query(query,['employee',name,email,phone,date_of_joining,designation,room_no,school,instructor_id],
			function(err,done){
				if(err){console.log(err);return;}
				else if(done){
				console.log("Teacher information updated");
				res.status(200).json({'message':'Teacher Information Updated'});
				}
		})
	},

	addNewTeacher:function(req,res){
		var {name,email,phone,date_of_joining,designation,room_no,school,password}=req.body.teacherData;
		if(date_of_joining==""){date_of_joining="0000-00-00";}
		con.query('select instructor_id from employee where instructor_id like "EMP%" order by instructor_id desc limit 1',function(err,found){
			var instructor_id="";
			if(err){
				console.log(err);
				return
			}else if(found.length==1){
				var lastInsId=found[0].instructor_id;
				var id=Number(lastInsId.substr(3));
				id+=1;
				instructor_id=lastInsId.substring(0,3)+id;
			}else if(found.length==0){
				instructor_id="EMP10000";
			}

			con.query('insert into ?? values (?,?,?,?,?,?,?,?,?,NULL,NULL)',
					['employee',instructor_id,name,email,phone,date_of_joining,password,designation,room_no,school],
				function(err,resp){
					if(err){console.log(err);return;}
					else if(resp){
						console.log("Employee inserted");
						res.status(200).json({'message':'New Teacher Inserted'});
					}
				})
		}) 
		
	},

  upload_photo: function(req, res) {
        
         console.log("in upload section");
          var storage = multer.diskStorage({
           destination: function (req, file, cb) {
           	console.log("destination");
          cb(null, './facultyFrontend/app/instructor_images/'+req.session.ins.school+'/')
          },
          filename: function (req, file, cb) {
          cb(null, req.session.ins.instructor_id + '.jpg')
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


    
	populate: function(req, res) {
		console.log("populate function called");
		//console.log(req.session.ins);
		console.log(req.query);
		var ins_id = req.query.instructor_id;
		var year = req.query.year;
		var college_name = req.query.school;

		console.log('In populate');

		var tables = {
			batch_allocation: college_name + '_batch_allocation',
			subject_allocation: college_name + '_subject_allocation_' + year,
		};
		console.log("tables");
		console.log(tables);
		var query =` select * from  ${tables.subject_allocation}  as s  inner join  ${tables.batch_allocation}
			   		as b on s.batch_id = b.batch_id  where s.instructor_code = ${ins_id} ` ;
		console.log("Query");
		console.log(query);

		con.query(query, function(error, result) {
			console.log("Result of query");
			console.log(result);
			if (error) {
				console.log(error);
				var obj = { status: 400, message: 'There is error in query!' };
				res.json(obj);
			} else if (result[0] == null) {
				console.log("No ");
				var obj = { status: 400, message: 'Oops ! .' };
				res.json(obj);
			} else {
				//console.log(result);
				var obj = { status: 200, message: 'Successfull', data: result };
				res.json(obj); //Successfull
			}
		});
	},
	/**
	 * [dashboard description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	dashboard: function(req, res) {
		console.log('In dashboard');
		var year = req.query.year;
		var semester = Number(req.query.semester);
		var college_name = req.query.school;
		if (year == null || semester == null || college_name == null) {
			var obj = { status: 400, message: 'Not All Fields Set' };
			res.json(obj);
		} else {
			var tables = {
				batch_allocation: college_name + '_batch_allocation',
				subject_allocation: college_name + '_subject_allocation_' + year,
				feedback: college_name + '_feedback_' + year,
				employee: 'employee',
			};
 
         var ins_id = req.query.instructor_id;

		
		/*<<<<<<< HEAD
		//		var college_name = req.query..college_name;
		//		var subject_type  =req.query.subject_type;
		//=======
		var year = req.query.year;
		var college_name = req.query.school;
		//>>>>>>> a066d0d19f09d6fe28085ea6aff24763700e4738
		var subject_name = req.query.subject_name;
		var course = req.query.course;
		var stream = req.query.stream;
		var semester = Number(req.query.sem);
		console.log('course' + course);
		var ins_id = req.query.instructor_id;

		if (year == null || course == null || stream == null || semester == null) {
			console.log(year);
			// console.log(subject_type)
			var obj = { status: 400, message: 'Not All Fields Set' };
			res.json(obj);
		} else {
			var tables = {
				batch_allocation: college_name + '_batch_allocation',
				subject_allocation: college_name + '_subject_allocation_' + year,
				feedback: college_name + '_feedback_' + year,
				employee: 'employee',
			};

			console.log(tables);*/

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
f.no_of_students_evaluated`
			var query =
				' select '+fin+' from ' + tables.subject_allocation + ' as s  ' +
				' inner join  ' +   tables.batch_allocation +
				' as b on s.batch_id = b.batch_id ' +
				' inner join  ' +
				tables.employee +
				' as e on s.instructor_code =e.instructor_id ' +
				' inner join  ' +
				tables.feedback +
				' as f on s.feedback_id = f.feedback_id where f.no_of_students_evaluated !=0 and s.instructor_code =' + ins_id;
			console.log(query);
			con.query(query, function(error, result) {
				console.log(result);
				if (error) {
					console.log(error);
					var obj = { status: 400, message: 'There is error in query!' };
					res.json(obj); // Connection Error
				} else if (result[0] == null) {
					console.log('No Teacher Found');
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

	removePrefixes:			function(req,res){
		var prefix=req.body.prefix+'%';
		console.log(prefix);
		con.query('select name from ?? where name like ?',['employee',prefix],(err,resp)=>{
			if(err){
				console.log(err);
				return;
			}
			resp.forEach(function(ins,ind){
				console.log(ins);
				var newName=ins.name.substr(prefix.length);
				console.log("Name : "+ins.name);
				con.query('update ?? set name=? where name=?',['employee',newName,ins.name],function(err,resp2){
					if(err){
						console.log(err);
						return;
					}
					console.log('updated');
					if(ind==resp.length-1){
						res.json({'message': 'updated','teachers':resp.length});
					}
				})
			})
			
		})
	}
};
