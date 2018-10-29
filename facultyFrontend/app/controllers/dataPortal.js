	faculty.controller('dataPortalCtrl', function($http, $scope, dataPortalService, $location) {

	$scope.disabled = false;

	$scope.collegeList = [ {
		collegeName : "University School of Law and Legal Studies",
		collegeCode :"uslls"},

		{ collegeName :"University School of Management Studies",
		collegeCode: "usms" },

	    { collegeName :"University School of Education",
		collegeCode:  "use" },

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
		collegeCode : "usict"}
	];

	$scope.semesterList= [1,2,3,4,5,6,7,8]

	$scope.courseList = [];

	$scope.stream = [];

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

				$(document).ready(function () {
					$('select').material_select();
				})

				}
			})

		}

		// console.log($scope.selectedCollege);
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


	$scope.getTeachers = function() {
		dataPortalService.getTeacher(function(res) {
			var data_value  = {}
			res.forEach(function(val) {
				data_value[val.name + ' ' + val.instructor_id] = null;

				// init autocomplete
				$(document).ready(function() {
					 $('input.autocomplete').autocomplete({
						 data : data_value,
					 });
				 });


			})
		})
	}


	$scope.streamSelected = function() {
		if (!$scope.selectedCollege || !$scope.selectedCourse || !$scope.selectedStream) {
			return;
		}
	}

	$scope.search = function() {
		dataPortalService.getSubjects($scope.collegeCode, $scope.selectedCourse, $scope.selectedStream, $scope.selectedSem, function(response) {
			console.log(response)
			if (response) {
				$scope.subjects_data = response;
				$(document).ready(function () {
					$('select').material_select();
				})

				$scope.getTeachers();
			}
		})
	}

	$scope.deleteSubject = function(index) {
		$scope.subjects_data.splice(index, 1);
	}

	$scope.submit = function() {

		$scope.disabled = true;

		dataPortalService.sendSubjectData($scope.collegeCode, $scope.selectedCourse, $scope.selectedStream, $scope.selectedSem, $scope.subjects_data, function(res) {
			if (res.data) {
				if (res.data.status == 200) {
					alert(res.data.message);
					$location.path("/");
				} else {
					alert(res.data.message);
					$location.path("/dataPortal");
				}
			}

		})
	}


	$scope.add = function() {
		$scope.subjects_data.push({
			'subject_name'  : '',
			'type' : '',
			'subject_code' : '',
			'teacher_name' : '',
		})
		$scope.getTeachers();
	}

})
