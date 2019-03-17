faculty.controller("tCtrl", function($scope, $rootScope,$localStorage, $location, teacherService) {
	$scope.teacher  = [];
	$scope.editName=$scope.editDoj=$scope.editEmail=$scope.editPhone=$scope.editRoom=$scope.editName=true;

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

	{collegeName :"University School of Humanities and Social",
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
	
	teacherService.getDetails(function(response) {
		response.date_of_joining=response.date_of_joining.split('T')[0];
		$scope.teacher = response;
		console.log($scope.teacher);
	});

	

	$scope.checkStatus = function() {
		$location.path("/teacherAnalysis");
	}

	$scope.logout = function(req,res) {
		teacherService.logout(function(response){		
			if(response){
				$location.path("/");
				alert(response.message);
			}
		})
	}	
	
	$scope.updateTeacherInfo=function(){	
		//console.log($scope.teacher);
		teacherService.updateTeacherInfo($scope.teacher,function(resp){
			alert(resp.message);	
		})
	}

})
