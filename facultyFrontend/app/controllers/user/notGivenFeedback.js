faculty.controller('notGivenFeedbackCtrl', function ($scope, $rootScope, $location, userService) {

	$scope.collegeList = [ {
		collegeName : "University School of Law and Legal Studies",
		collegeCode :"uslls"},

		{collegeName :"University School of Management Studies",
		collegeCode: "usms"},

	    {collegeName :"University School of Education",
		collegeCode:  "use"},

		{collegeName :"University School of BioTechnology",
		collegeCode : "usbt"},

		{collegeName :"University School of Chemical Technology",
		collegeCode : "usct"},

		{collegeName :"University School of Environment Management",
	    collegeCode : "usem"},

	    {collegeName :"University School of Mass Communication",
		collegeCode : "usmc"},

		{collegeName :"University School of Basic and Applied Sciences",
		collegeCode :  "usbas"},

		{collegeName :"University School of Architecture and Planning",
		collegeCode : "usap"},

		{collegeName :"University School of Humanities and Social",
		collegeCode : "ushss"},

		{collegeName :"University School of Info.,Comm. and Technology",
		collegeCode : "usict"
		}
	];

	$scope.semesterList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


	$scope.listOfStudents = [];

	$scope.getStudenelist = function() {
		if (!$scope.college || !$scope.semester || !$scope.courseName || !$scope.streamName) {
			alert("all field are not set. Set them completely");
			return;
		}

		var college 	= $scope.college.collegeCode;
		var semester 	= $scope.semester;
		var course 		= $scope.courseName.course;
		var stream 		= $scope.streamName.stream;
		console.log(college, semester, course, stream);
		console.log("1111");
		userService.getStudentStatus(college, semester, course, stream,  function(response) {
			if (response == "400") {
				alert("something wrong happened")
				$location.path("/notGivenFeedback");

			} else {
				console.log(response);

				var seggregatedStudentList = _.groupBy(response, function(result) {
            		var type = "s_" + semester;
            		console.log(type);
            		return result[type];
        		});

				var selectedStudents = seggregatedStudentList[1];
				var nonSelectedStudents = seggregatedStudentList[0];

				if (!selectedStudents) {
					selectedStudents = [];
				}

				if (!nonSelectedStudents) {
					nonSelectedStudents = [];
				}

				console.log(selectedStudents);
				console.log(nonSelectedStudents);
				$scope.selectedStudents = selectedStudents;
				$scope.nonSelectedStudents = nonSelectedStudents;

				$scope.listOfStudents = response;
			}
		})
	}

	$scope.setCollege = function(singleCollege) {
		if (!singleCollege) {
			return;
		}

		if (!$scope.semester) {
			alert("Please fill the semester block first");
			return;
		}

		$scope.college = singleCollege;
		userService.getStudentDetails($scope.college.collegeCode,$scope.semester, function(response) {
			if (response == "400") {
				alert("something wrong happened")
			} else {
				console.log("Asdasdasd");
				$scope.courseList = response.course;
				$scope.streamList = response.stream;
			}
		})
	}

	$scope.setCourseName = function(courseName) {
	 	if (!courseName) {
	 		return;
	 	}

	 	$scope.courseName = courseName;
	}

	$scope.setStreamName = function(streamName) {
		if (!streamName) {
			return;
		}

		$scope.streamName = streamName;
	}

	$scope.setSemester = function(semester) {
		if (!semester) {
			return;
		}

		$scope.semester = semester;
	}

});
