faculty.factory('teacherService', ['$http', '$timeout', '$rootScope', function($http, $timeout, $rootScope) {
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

		populate: function(callback) {
			$http({
				method: "GET",
				url: BACKEND + "/tpopulate",
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
		}
	}
}])
