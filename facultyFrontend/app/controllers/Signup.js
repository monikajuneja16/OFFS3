faculty.controller('SignupCtrl',function($scope, $rootScope, $location, userService, facultyService, Captcha) {

	$scope.user = {};
	$scope.name = "";

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

    $scope.userCategoryList = [
    	"student", "Dean"
    ];

  	$scope.setCollege = function(singleCollege) {
		$scope.college = singleCollege;
		$rootScope.college = singleCollege;
	}
	

	$scope.setUserCategory =  function(userCategory) {
		$scope.user.category = userCategory;
	}

	$scope.setCollege($scope.collegeList[$scope.collegeList.length - 1])
 $scope.setUserCategory('Dean');

	$scope.findSemister = function() {
		var roll = _.clone($scope.user.rollno);
		var	year = roll.substring(roll.length -2, roll.length);
		$scope.user.semister = (17 - year)*2 + 1;
		$rootScope.semester = $scope.user.semister;
	}

	$scope.updateSemester = function() {
		$rootScope.semester = $scope.user.semister;
		console.log($rootScope.semester);
	}

	$scope.LoginUser = function() {

			$scope.hidebutton  = true;
			$scope.showSpinner = true;

		if (!$scope.collegeName && !$scope.user.category && !$scope.user.rollno && !$scope.user.email) {
			return;
		}
// idhar college Name ayeg kya?
		console.log($scope.college, $scope.user);
		if ($scope.user.category == "Dean") {
			facultyService.send_details($scope.college.collegeCode, $scope.user, function(response) {
				if (response.status == 400) {
					alert(response.message);
					$location.path("/");
				} else {
					
					$location.path("/deanAnalysis");
				}
			})
		} else {
			userService.send_details($scope.college.collegeCode, $scope.user, function(response) {
				if (response == 400) {
					$location.path('/')

				} else {
					$rootScope.tablename = $scope.college.collegeCode + '_' + $scope.user.category;
					$rootScope.rollno = $scope.user.rollno;
					console.log($rootScope);
					$location.path('/verify');
				}
			})
		}
	}

	$scope.verifyUser = function() {
			$scope.v1 = true;
			$scope.v2 = true;
		if (!$scope.otp) {
			return;
		}
		var tablename = $rootScope.tablename;
		var rollno = $rootScope.rollno;
		console.log($rootScope.tablename);

		userService.verifyUser($scope.otp, tablename, rollno, function(response) {
			if (response == 400) {
				alert('User is not verified');
				$location.path('/');
			} else {
				$rootScope.userDetails = response;
				console.log($rootScope);
				$location.path('/dashboard');
			}

		})
	}
})
