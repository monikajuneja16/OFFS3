faculty.factory('dataStatusService',['$http', '$timeout', '$rootScope','$window','$location', function($http, $timeout, $rootScope,$window,$location){
	 
	return {
		getSubjectDataStatus: function(college, callback) {
			$http({
				method: "GET",
				url: BACKEND + '/getSubjectStatus',
				params: {
					college: college
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

		getSubjectDataStatusByCourse: function(college, course, callback) {
			$http({
				method: "GET",
				url: BACKEND + '/getSubjectStatusByCourse',
				params: {
					college: college,
					course: course
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

		getSubjectDataStatusByCourse: function(college, course, stream, callback) {
			$http({
				method: "GET",
				url: BACKEND + '/getSubjectStatusByStream',
				params: {
					college: college,
					course: course,
					stream: stream
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

		getSubjectDataStatusBySemester: function(college, course, stream, semester, callback) {
			$http({
				method: "GET",
				url: BACKEND + '/getSubjectStatusBySemester',
				params: {
					college: college,
					course: course,
					stream: stream,
					semester: semester
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
