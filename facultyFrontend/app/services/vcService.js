faculty.factory('vcService', ['$http', '$timeout', '$rootScope', function($http, $timeout, $rootScope) {
	return {
		send_details : function(college, user, callback) {
			$http({
				method: "POST",
				url: BACKEND + '/vinitials',
				params: {
					college_name: college,
					vc_id: user.rollno,
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
		 		url: BACKEND + "/vlogout",
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
    
    updateVcInfo:function(vcData,callback){
			$http({
				method:"POST",
				url:BACKEND + "/vupdateInfo",
				data:{
					vcInfo:vcData
				}
			})
			.then(function(response){
				if(callback){callback(response.data)}
			},function(error){
				if(error){callback(error.data)}
			})
		},

		getDetails: function(callback) {
			$http({
				method: "GET",
				url: BACKEND + "/vchecksession",
			}).then(function(response) {
				if (callback) {
					callback(response.data);
				}
			}, function(error) {
				if (callback) {
					console.error(error);
					callback(error);
				}
			})
		},

		getFeedback: function(college, year, callback) {
			$http({
				method: "GET",
				url: BACKEND + "/vdashboard",
				params: {
					year: year,
					college_name: college
				}
			}).then(function(response) {
				if (callback) {
					callback(null,response.data);
				}
			}, function(response) {
				if (callback) {
					console.error(response.data);
					callback(response.data);
				}
			})
		},
 	}
}]);
