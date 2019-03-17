faculty.controller('newTeacherCtrl', ['$http', '$scope', 'teacherService', '$window', '$location',function($http, $scope, teacherService, $window, $location) {

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

	$scope.desigList= ['Professor', 'Associate Professor', 'Assistant Professor', 'Guest Faculty', 'PhD Scholar']

	$scope.flag = 0;

	$scope.collegeSelected = function() {
		if (!$scope.selectedCollege) {
			return;
		}

		var coll = $scope.selectedCollege;
		var collegeCode = "";

		var CollegeCodes = _.where($scope.collegeList, {
			collegeName: coll
		});
		_.forEach($scope.collegeList, function (value, key) {

			if ((value.collegeName) == (coll)) {
				$scope.college = value.collegeCode;
			}

	})}

	$scope.checkPassword = function () {

		if ($scope.password == $scope.repeat) {
			return;
		}

		else {
			$scope.flag = 1;
			$scope.password = "";
			$scope.repeat = "";
			alert("The password do not match. Please try again");
		}
	}
	
	$scope.submit = function () {

		console.log($scope.college);

		if (!checkData() && $scope.flag == 0) {
			alert("Please fill all the details");
			return;
		}

		teacherService.addTeacher($scope.name, $scope.email, $scope.phone, $scope.designation, $scope.room_no, $scope.college, $scope.password, function (res) {
			if (res) {
				$window.alert(res.message);
				location.reload();
					
			} else {
				$window.alert("An error occured. Please try again");
				$location.path("/newTeacher");
			}
		})
	}

	function checkData() {
		if (!$scope.name || !$scope.email || !$scope.phone || !$scope.designation || !$scope.room_no || !$scope.college || !$scope.password || !$scope.repeat) {
			return false;
		}
		return true;
	}
}])