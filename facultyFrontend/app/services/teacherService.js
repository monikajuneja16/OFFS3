faculty.factory('teacherService', ['$http','$localStorage', '$timeout', '$rootScope', function($http, $localStorage,$timeout, $rootScope) {
	return  {

		send_details : function(college, user, callback) {
			
			$http({
				method: "POST",
				url: BACKEND + '/tinitials',
				params: {
					college_name: college,
					ins_id: user.rollno,
					password: user.password
				}

			}).then(function(response) {
				if (callback) {
					callback(response.data);
				}
			}, function(response) {
				if (callback) {
					console.error(response.data);
					callback(response.data);
				}
			})
		},

		getDetails: function(callback) {
			$http({
				method: "GET",
				url: BACKEND + "/tchecksession",
			}).then(function(response) {
				if (callback) {
					callback(response.data);
				}
			}, function(response) {
				if (callback) {
					console.error(response.data);
					callback(data);
				}
			})
		},

		logout : function(callback){
		 	$http({
		 		method:"GET",
		 		url: BACKEND + "/tlogout",
		 	}).then(function(response) {
				if (callback) {
					callback(response.data);
				}
			}, function(response) {
				if (callback) {
					console.error(response.data);
					callback(data);
				}
			})
		},		

		updateTeacherInfo:function(teacherData,callback){
			$http({
				method:"POST",
				url:BACKEND + "/tupdateInfo",
				data:{
					teacherInfo:teacherData
				}
			})
			.then(function(response){
				if(callback){callback(response.data)}
			},function(error){
				if(callback){callback(error.data)}
			})
		},

		populate: function(year,callback) {
			console.log("$rootScope");
			
			console.log($localStorage);
			$http({
				method: "GET",
				url: BACKEND + "/tpopulate",
				params: {
					year:year,
					instructor_id:$localStorage.teacher.instructor_id,
					school:$localStorage.teacher.school
				}
			}).then(function(response) {
				if (callback) {
					callback(response.data);
				}
			}, function(response) {
				if (callback) {
					console.error(response.data);
					callback(response.data);
				}
			})
		},

		getTeacherfb: function(course, sem, stream, subject, year, callback) {
			$http({
				method: "GET",
				url: BACKEND + "/tdashboard",
				params: {
					course: course,
					sem: sem,
					stream: stream,
					subject: subject,
					instructor_id:$localStorage.teacher.instructor_id,
					school:$localStorage.teacher.school,
					year: year
				}
			}).then(function(response) {
				if (callback) {
					callback(response.data);
				}
			}, function(response) {
				if (callback) {
					console.error(response.data);
					callback(response.data);
				}
			})
		},

		addTeacher: function(name, email, phone, designation, room_no, school, password, callback) {
			$http({
				method:'POST',
				url: BACKEND + '/taddNewTeacher',
				data: {
                    teacherData:{
                        name : name,
                        email : email,
						phone : phone,
						date_of_joining: '',
                        designation : designation,
                        room_no : room_no ,
                        school : school,
                        password : password
                    }
				}
			}).then(function(response) {
				if (callback) {
					callback(response.data);
				}
			}, function(response) {
				if (callback) {
					console.error(response.data);
					callback(response.data);
				}
			})
        }
	}
}])
