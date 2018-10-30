faculty.factory('studentDataService',['$http', '$timeout', '$rootScope', function($http, $timeout, $rootScope) {
	return {
		getCourse: function(college, callback) {
			$http({
				method: "GET",
				url: BACKEND + '/getCourse',
				params: {
					college_name: college
				}
			}).then(function(response) {
				if (callback) {
					callback(response.data);
				}
			}, function(response) {
				if (callback) {
					callback(response.data);
				}
			})
		},

		getStream:  function(college, course, callback) {
			$http({
				method: "GET",
				url: BACKEND + '/getStream',
				params: {
					college_name : college,
					course: course
				}
			}).then(function(response) {
				if (callback) {
					callback(response.data);
				}

			}, function(response) {
				if (callback) {
					callback(response.data);
				}
			})
		},

		getData : function(college, selectedYear, callback) {
			$http({
				method:'GET',
				url: BACKEND + '/updateStudent',
				params: {
					college : college,
					year: selectedYear
				}
			}).then(function(response) {
				if (callback) {
					callback(response.data);
				}
			}, function(response) {
				if (callback) {
					console.error(response);
					callback(response);
				}
			})
		},


		sendData : function(college, course, stream, selectedYear, student_data, callback) {
			$http({
				method:'POST',
				url: BACKEND + '/sendStudent',
				params: {
					data : student_data,
					college : college,
					course : course,
					stream: stream,
					year: selectedYear
				}
			}).then(function(response) {
				if (callback) {
					callback(response.data);
				}
			}, function(response) {
				if (callback) {
					console.error(response);
					callback(response);
				}
			})
		}


	}
}])
