faculty.controller('notGivenFeedbackCtrl', function ($scope, $location, userService, dataPortalService) {

	$scope.collegeList = [ {collegeName :"University School of Architecture and Planning",
		collegeCode : "usap"},

		{collegeName :"University School of Basic and Applied Sciences",
		collegeCode :  "usbas"},

		{collegeName :"University School of BioTechnology",
		collegeCode : "usbt"},

		{collegeName :"University School of Chemical Technology",
		collegeCode : "usct"},

		{ collegeName :"University School of Education",
		collegeCode:  "use" },

		{collegeName :"University School of Environment Management",
	    collegeCode : "usem"},

		{collegeName :"University School of Humanities and Social Sciences",
		collegeCode : "ushss"},

		{collegeName :"University School of Info.,Comm. and Technology",
		collegeCode : "usict"},

		{collegeName : "University School of Law and Legal Studies",
		collegeCode :"uslls"},

		{collegeName :"University School of Mass Communication",
		collegeCode : "usmc"},

		{ collegeName :"University School of Management Studies",
		collegeCode: "usms" },
	];

	$scope.semesterList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	$scope.listOfStudents = [];

	$scope.searched = false;

	$scope.collegeSelected = function() {
		if (!$scope.selectedCollege) {
			return;
		}

		var college = $scope.selectedCollege;
		var collegeCode = "";

		var CollegeCodes = _.where($scope.collegeList, { collegeName: college });
		_.forEach($scope.collegeList, function(value, key) {

			if ((value.collegeName) == (college)) {
				$scope.collegeCode = value.collegeCode;
			 }

		})

		if ($scope.collegeCode) {
			dataPortalService.getCourse($scope.collegeCode, function(responce) {
				if (responce) {
                    console.log(responce);
					$scope.courseList = responce;
					// $scope.courseList = JSON.parse(responce);
					console.log(typeof $scope.courseList);
					//console.log("Courses:: "+$scope.courseList);
				$(document).ready(function () {
					$('select').material_select();
				})

				}
			})

		}

		 console.log($scope.selectedCollege);
	}

	$scope.courseSelected = function() {
		if (!$scope.selectedCourse || !$scope.selectedCollege) {
			return;
		}

		if ($scope.collegeCode && $scope.selectedCourse) {
			dataPortalService.getStream($scope.collegeCode, $scope.selectedCourse, function(responce) {
				if (responce) {
					console.log(responce);
					$scope.streamList = responce;
					$(document).ready(function () {
						$('select').material_select();
					})
				}
			})
		}
	}

	$scope.streamSelected = function() {
		if (!$scope.selectedCollege || !$scope.selectedCourse || !$scope.selectedStream) {
			return;
		}
	}

	$scope.getStudentList = function() {
		$scope.searched = true;
		console.log($scope.selectedCollege);
		console.log($scope.selectedSem);
		console.log($scope.selectedCourse);
		console.log($scope.selectedStream);
		userService.getStudentStatus($scope.collegeCode, $scope.selectedSem, $scope.selectedCourse, $scope.selectedStream,  function(response) {
			if (response == "400") {
				alert("something wrong happened")
				$location.path("/status");

			} else {
				console.log(response);

				var seggregatedStudentList = _.groupBy(response, function(result) {
					console.log(result);
            		var type = "s_" + $scope.selectedSem;
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

});