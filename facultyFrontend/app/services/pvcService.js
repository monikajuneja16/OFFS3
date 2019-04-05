faculty.factory('pvcService',['$http','$localStorage', '$timeout', '$rootScope', function($http, $localStorage,$timeout, $rootScope) {
	return  {

		send_details : function(college, user, callback) {
			$http({
				method: "POST",
				url: BACKEND + '/pvinitials',
				params: {
					college_name: college,
					pvc_id: user.rollno,
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
		 		url: BACKEND + "/pvclogout",
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
		getDetails: function(callback) {
			$http({
				method: "GET",
				url: BACKEND + "/pvchecksession",
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

		updatePvcInfo:function(pvcData,callback){
			$http({
				method:"POST",
				url:BACKEND + "/pvcupdateInfo",
				data:{
					pvcInfo:pvcData
				}
			})
			.then(function(response){
				if(callback){callback(response.data)}
			},function(error){
				if(callback){callback(error.data)}
			})
		},

		getFeedback: function(college, year, callback) {
			$http({
				method: "GET",
				url: BACKEND + "/pvdashboard",
				params: {
					year: year,
					college_name: college
				}
			}).then(function(response) {
				if (callback) {
					callback(null,response.data);
				}
			}, function(response){
				if (callback) {
					console.error(response.data);
					callback(response.data);
				}
			})
		}
 	}
}]);
