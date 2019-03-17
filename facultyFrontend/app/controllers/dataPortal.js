faculty.controller('dataPortalCtrl', ['$http', '$scope', 'dataPortalService', '$location',function($http, $scope, dataPortalService, $location) {

	

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

	$scope.semesterList= [1,2,3,4,5,6,7,8]

	$scope.courseList = [];

	$scope.check = 0;

	$scope.stream = [];
	var data_value  = {};
	$scope.searched = false;
	// $scope.disabledataPortal=true;

	$scope.changeFlag = function(item) {
		if(!(angular.isUndefined(item.teacher_name))) {
			item.flag = 1;
			dataPortalService.getTeacher(function(res) {
				res.forEach(function(val) {
					if(item.teacher_name == (val.name + ' ' + val.instructor_id)){
						item.flag = 2;
						return;
					}
				})
			})
		}
	}

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

	
	$scope.getTeachers = function() {
		dataPortalService.getTeacher(function(res) {
			
			res.forEach(function(val) {
				data_value[val.name + ' ' + val.instructor_id] = null;

				// init autocomplete
				$(document).ready(function(){
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
		
		$scope.searched = true;

		dataPortalService.getSubjects($scope.collegeCode, $scope.selectedCourse, $scope.selectedStream, $scope.selectedSem, function(response) {
			console.log(response)
			if (response) {
				$scope.subjects_data = response;
				$scope.check = $scope.subjects_data.length;
				for(var i=0; i<$scope.check; i++){
					$scope.subjects_data[i].flag = 0;
				}
				$(document).ready(function () {
					$('select').material_select();
				})

				$scope.getTeachers();



			}
		})

		
		
		
	}

	$scope.deleteSubject = function(index) {
		$scope.subjects_data.splice(index, 1);
		$scope.check = ($scope.check)-1;
	}

	// function checkData(){
		
	// 	if(Object.getOwnPropertyNames(data).length>0)
	// 	$scope.disabledataPortal=false;

	// }

		

	
	$scope.submit = function() {

		for(var i=0; i<$scope.check; i++){
			if($scope.subjects_data[i].flag == 0){
				alert("Kindly fill names of all faculty members");
				return;
			}
			else if($scope.subjects_data[i].flag == 1){
				alert("Kindly fill names from dropdown only");
				$scope.subjects_data[i].flag = 0;
				return;
			}
		}
		
		//$window.alert("Data recorded");
		dataPortalService.sendSubjectData($scope.collegeCode, $scope.selectedCourse, $scope.selectedStream, $scope.selectedSem, $scope.subjects_data, function(res) {
			if (res.data) {
				if (res.data.status == 200) {
					//console.log("Data recorded");
					//$window.alert("Data recorded");
					
					
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
		$scope.check = ($scope.check)+1;
		$scope.getTeachers();
	}

}])