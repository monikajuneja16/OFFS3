faculty.factory('facultyService', ['$http', '$timeout', '$rootScope', function($http, $timeout, $rootScope) {
	return {
		send_details : function(college, user, callback) {
			$http({
				method: "POST",
				url: BACKEND + '/dinitials',
				params: {
					college_name: college,
					dean_id: user.rollno,
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
		logout : function(callback){
		 	$http({
		 		method:"GET",
		 		url: BACKEND + "/dlogout",
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

		updateDeanInfo:function(deanData,callback){
			$http({
				method:"POST",
				url:BACKEND + "/dupdateInfo",
				data:{
					deanInfo:deanData
				}
			})
			.then(function(response){
				if(callback){callback(null,response.data)}
			},function(error){
				if(callback){callback(error.data);}
			})
		},
		
		getDetails: function(callback) {
			$http({
				method: "GET",
				url: BACKEND + "/dchecksession",
			}).then(function(response) {
				if (callback) {
					callback(response.data);
				}
			}, function(response) {
				
					console.error(response.data);
				
			})
		},

		getFeedback: function(college, year, callback) {
			$http({
				method: "GET",
				url: BACKEND + "/ddashboard",
				params: {
					year: year,
					college_name: college
				}
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

		getBatchData: function(collegeName,year,course,stream,semester){
			return $http({
				method: "GET",
				url: BACKEND + "/getStudentStatus",
				params: { year,collegeName,course,semester,stream }
			})
			.then(function(response) {
				return Promise.resolve(response.data);
			})
			
		},

		getBatches:function(school){
			return $http({
				method:"get",
				url: BACKEND + "/dgetBatches",
				params:{school}
			})
			.then(({data})=>{
				return Promise.resolve(data)
			})
			.catch(({response})=>{
				return Promise.reject(response.data.message);
			})
		}
 	}
}]);
