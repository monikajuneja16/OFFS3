var con 	   = require("../../models/mysql"),
 	ses        =   require('node-ses'),
 	async      =  require('async'),
 	controller = require("../../models/config"),
    nodemailer = require('nodemailer'),
    multer=require('multer');

module.exports = {

	index: function (req, res) {

	},

    logout: function(req, res) {
    console.log("logout")
    if (req.session.vc) {
         req.session.destroy();
         var obj={status:200,message:"Logged Out"};
         console.log(obj);
         res.json(obj);
     } else{
      console.log("No session detected");
      var obj = { status: 200, message: "No session detected" };
    }
  },
  updateVcInfo   :   function(req,res){
		var {name,email,phone,date_of_joining,designation,room_no,school,instructor_id}=req.body.vcInfo;
		var wrong_info="";

		if(name==undefined || name==""){wrong_info+=", Name";}
		if(email==undefined ||email==""){wrong_info+=", Email";} 
		if(phone==undefined || phone==0){wrong_info+=", Phone";} 
		if(date_of_joining==undefined || date_of_joining=="" || date_of_joining=="0000-00-00"){wrong_info+=", Date of Joining";}
		if(designation==undefined){wrong_info+=", Designation";}
		if(room_no==undefined || room_no==""){wrong_info+=", Room Number";}
		if(instructor_id==undefined){wrong_info+="Instructor Id"}
		
		if(wrong_info.length>2){
					console.log("Wrong VC information");
					res.status(400).json({'message' : 'Please provide valid input for'+wrong_info.substr(1)+' to record information. Please hover over the input fields to check for format of information.'});
					return;
		}
		console.log(name+" - "+email+" - "+phone+" - "+date_of_joining+" - "+designation+" - "+room_no+" - "+school+" - "+instructor_id);
		var query="update ?? set name=?,email=?,phone=?,date_of_joining=?,designation=?,room_no=?,school=? where instructor_id=?"
		con.query(query,['employee',name,email,phone,date_of_joining,designation,room_no,school,instructor_id],
			function(err,done){
				if(err){console.log(err);return;}
				else if(done){
				console.log("vc information updated");
				res.status(200).json({'message':' Vice Chancellor Information Updated'});
				}
		})
	},
  upload_photo: function(req, res) {
        
         console.log("in upload section");
          var storage = multer.diskStorage({
           destination: function (req, file, cb) {
           	console.log("destination");
          cb(null, './facultyFrontend/app/instructor_images/vc/')
          },
          filename: function (req, file, cb) {
          cb(null, 'vc.jpg')
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
	initials: function(req,res) {
		console.log('vc initials');
		console.log(req.query);
		var college_name = req.query.college_name;
		var vc_id 	 = req.query.vc_id;
		var password	 = req.query.password;
		var query 		 = 'select * from employee where instructor_id = ? and password = ?';
		console.log(college_name, vc_id, password);
	    if(college_name != null && vc_id != null && password != null) {		//Check For all fields
			con.query(query,[vc_id,password],function(error,result) {
				console.log(result);
			if(error) {
				console.log(error);
				var obj = { status:400 , message :"There is error in query!"};
				res.json(obj);

			} else if(result[0] == null) {
				var obj = { status:400 , message :"'Wrong credentials entered for Vice Chancellor'"};
				res.json(obj);  		// Invalid Password or username

			} else {
				console.log(result[0]);
				req.session.vc = result[0];
				req.session.vc.college_name = req.query.college_name;
				console.log(req.session.vc);
				var obj = { status:200 , message :"VC authentication Successfull"};
				res.json(obj);  	 //Successfull
			}

		})}	else {
			console.log("Not All Fields Set")
			var obj = { status:400 , message :"Not All Fields Set"};
			res.json(obj);
		}
	},

	checksession : function(req,res) {
		/*  This route is just to check if sessions are working .
			Hit this url once you have logged in.	*/
			console.log("sssssssssssssssssssss");
			var vcSession=req.session.vc;
			if(vcSession) {
				console.log(vcSession);
				res.status(200).json(vcSession);
			}

			else
			{
				console.log("No session detected");
				var obj = {status:200,message:"No session detected"} ;
			}
	},
	dashboard	: function(req,res) {
		console.log('In dashboard');
		var year = req.query.year;
		var college_name  =req.query.college_name;

		if(year==null|| college_name==null) {
			console.log(year)
			console.log(college_name)
			var obj = { status:400 , message :"Not All Fields Set"};
			res.json(obj);
		}
		else
		{   var tables = {
			       batch_allocation    :college_name + '_batch_allocation',
				   subject_allocation :college_name + '_subject_allocation_' + year,
				   feedback		   	  :college_name + '_feedback_'          + year,
		   		   employee			  :'employee'
		   	}

		   	console.log(tables);
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
			var query =	' select '+fin+' from '+ tables.subject_allocation+' as s  ' +
					   	' inner join  '+ tables.batch_allocation+' as b on s.batch_id = b.batch_id ' +
					   	' inner join  '+ tables.employee+' as e on s.instructor_code =e.instructor_id '+
					   	' inner join  '+ tables.feedback+' as f on s.feedback_id = f.feedback_id where no_of_students_evaluated != 0'
					   	;
					   	console.log(query);
		    con.query(query,function(error,result){
		    	if(error) {
					console.log(error);
					var obj = { status:400 , message :"There is error in query!"};
					res.json(obj);       // Connection Error
				}
				else if(result[0]==null){
					console.log("No VC Found");
					var obj = { status:400 , message :"No Such User Found ! ."};
					res.json(obj);  		// Invalid Password or username
				}
				else{
					console.log("Data fetched");
					console.log(result);
					res.json(result);

				}
		    })
		}
	},

	getInstructorImage: function(req,res){
		var {school,id}=req.params;
		console.log(req.params);
		id=id.split('.')[0];
		con.query('Select name from ?? where instructor_id=? and school=?',['employee',id,school],function(err,resp){
			if(err){console.log(err);return;}
			res.send(`Image does not exist for ${resp[0].name} of ${school.toUpperCase()}`);
		})
	}
}
