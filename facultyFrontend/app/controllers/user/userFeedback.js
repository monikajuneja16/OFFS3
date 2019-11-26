faculty.controller('feedbackCtrl',['$scope', '$rootScope', '$uibModal', '$log', '$document', '$location', 'userService','$localStorage',function($scope, $rootScope, $uibModal, $log, $document, $location, userService,$localStorage) {
	
	$scope.feedback;
	$scope.pointer  = 0;
	$scope.pointer2=0;
	$scope.seggregatedTeacherType = {}
	$scope.feedbackGivenByTheUser = [];
	$scope.disablenextattributes = true;
	$scope.currCheck=[];
	$scope.showSpinner=false;
	
	$scope.teacherFeedback = [
	];

	$scope.attributesList = {
		theory: [
			"Coverage of all the topics prescribed in the syllabus, with adequate depth and detail.",
			"Compliance with the number of teaching hours allotted and actual hours taught.",
			"Clarity of speech, pace of teaching, logical flows as well as continuity of thought and expression in lectures.",
			"Ability to explain the concepts clearly.",
	    	"Teaching methodology and the use of teaching aids (blackboard/power point presentation/OHP) adequately served your learning needs.",
	    	"Knowledge of the teacher in the subject.",
	    	"The extent of interaction students involvement students participation in discussing the subject matter.",
			"Encourages and makes you feel comfortable about asking questions. ",
			"Provides enthusiastic, clear and satisfactory response to students questions.",
			"Teacher generated enough interest and stimulated your intellectual curiosity.",
			"Teacher enhanced your capability to critically analyze and scrutinize scientific information.",
			"Stimulates and maintains interest and attention of students throughout the course.",
			"Because of the teacher you felt enthusiastic about studying the subject.",
			"How much enriched did you feel at the end of the course.",
			"Teaching helped you to develop an independent thinking/perspective about the subject."
			
		],
		practicals: [
			"The extent of direct supervision by the teacher throughout the practical.",
			"The theoretical basis technical considerations related to the experimental practical exercises were explained well.",
			"The experiments generated enough interest and helped in developing/strengthening your concepts.",
		    "Created sufficient opportunity for students to practice their skill.",
		    "Adequate time was devoted to interactive sessions to discuss analyze the results and clarify doubts of students.",
			"The teacher helped you build your capability to think and plan the experiments independently and analyze the results critically.",
			"Encourages and makes you feel comfortable about asking questions.",
			"Provides enthusiastic, clear and satisfactory response to student's questions."
		]

	}
	

	$scope.getInstructorsForFeedback = function() {

		console.log($localStorage);

		var tablename = $localStorage.userDetails.tablename;
		var table=tablename.split("_");

		$scope.college_name=table[0];
		// $scope.college_name = "usap";

		$scope.email = $localStorage.userInfo.email;
		// $scope.email = "hanugautam96@gmail.com";
		// var course = "B.Arch";
		// var stream = "Section A";
		// var semester = "1";
		
		var course = $localStorage.userInfo.course;
	
		
		

		var stream = $localStorage.userInfo.stream;
		var semester = $localStorage.semester;
		
		console.log($localStorage);
		
		
		console.log(course, stream, semester);
		userService.getInstructorsForFeedback($scope.college_name, course, stream, semester, function(response) {
			$scope.feedback = response;

			console.log(response);

			for (var x=0;x<$scope.feedback.length;x++) {
				$scope.feedback[x].type = $scope.feedback[x].type;

			}

			var seggregatedTeacherType = _.groupBy(response, function(result) {
            		return result.type;
        	});

			console.log(seggregatedTeacherType);
        	$scope.theoryTeacher = seggregatedTeacherType.Theory;
			$scope.practicalTeacher = seggregatedTeacherType.Practical;

        	if (!$scope.theoryTeacher) {
        		$scope.theoryTeacher = seggregatedTeacherType.theory;
        	}
        	if (!$scope.practicalTeacher) {
        		$scope.practicalTeacher = seggregatedTeacherType.practical;
        	}
        	if (!$scope.theoryTeacher) {
        		$scope.theoryTeacher = seggregatedTeacherType.THEORY;
        	}
        	if (!$scope.practicalTeacher) {
        		$scope.practicalTeacher = seggregatedTeacherType.PRACTICAL;
			}

			if($scope.practicalTeacher == null || $scope.practicalTeacher == undefined) {
				$scope.pointer2 = $scope.attributesList.practicals.length;	
			}
			else {
				$scope.pointer2 = -1;	
			}
		})
	}
	var j=0,i=0;
	// $scope.feedbackGivenByTheUser.push($scope.feedbackGivenByTheUser);
	$scope.addFeedbackToTheoryTeacher = function(theoryTeacher, index) {
		if ($scope.feedbackGivenByTheUser[index] == null || $scope.feedbackGivenByTheUser[index] == "") {
			return;
		}
		
		if($scope.feedbackGivenByTheUser.length>0){
			$scope.disablenextattributes = false;
		}

		if(isNaN($scope.feedbackGivenByTheUser[index])){
			alert("Please enter a number between 1-5");
			$scope.disablenextattributes = true;
			// console.log("Compare, not a number");
			$scope.feedbackGivenByTheUser.splice(index,1);
			return;
		}
		
		else if($scope.feedbackGivenByTheUser[index]<1 || $scope.feedbackGivenByTheUser[index]>5 ){
			alert("Please enter a number between 1-5");
			$scope.disablenextattributes = true;
			$scope.feedbackGivenByTheUser.splice(index,1);
			// console.log("Reached else if");
			return;
		}
		$scope.currCheck[$scope.pointer]=true;

		var foundTeacher = _.find($scope.teacherFeedback, ['feedbackId', theoryTeacher.feedback_id]);
		// var feedback = function($scope.feedbackGivenByTheUser);

		localStorage.setItem('Feedback'+j, $scope.feedbackGivenByTheUser);
				j++;
		//console.log(localStorage);
		
		// localStorage.setItem("stringFeedback[i]", JSON.stringify(feedback));
		// console.log(foundTeacher);

		if (foundTeacher) {
			if (foundTeacher.score[$scope.pointer] == null) {
				
				foundTeacher.score.push($scope.feedbackGivenByTheUser[index]);
				
				console.log(foundTeacher);
				console.log("Score : "+foundTeacher.score);
				console.log("Length : "+foundTeacher.score.length);
				
				// co = JSON.parse(localStorage.getItem('stringFeedback');
			} else {
				// console.log("yaham takk aagya abh aage kaya hoga")
				foundTeacher.score[$scope.pointer] = $scope.feedbackGivenByTheUser[index];
				// console.log(foundTeacher);
			}

		} else {
			$scope.teacherFeedback.push({
				feedbackId: theoryTeacher.feedback_id,
				score: [$scope.feedbackGivenByTheUser[index]],
				type: 'Theory',
				subject_code: theoryTeacher.subject_code,
				instructor_code: theoryTeacher.instructor_code

			})
			console.log($scope.teacherFeedback);	//stores info about teacher and his feedback  teacherFeedback[].feedbackId
		}

		
		i++;
	}
	// localStorage.setItem("stringFeedback", JSON.stringify($scope.feedbackGivenByTheUser));
	// $scope.feedbackGivenByTheUser.push($scope.feedbackGivenByTheUser);
	$scope.addFeedbackToPracticalTeacher = function(practicalTeacher, index) {
		if ($scope.feedbackGivenByTheUser[index] == null || $scope.feedbackGivenByTheUser[index] == "") {
			return;
		}
		// console.log("Proceed");
		if(isNaN($scope.feedbackGivenByTheUser[index])){
			alert("Please enter a number between 1-5");
			$scope.disablenextattributes = true;
			// console.log("Compare, not a number");
			$scope.feedbackGivenByTheUser.splice(index,1);
			return;
			
			}
			
		else if($scope.feedbackGivenByTheUser[index]<1 || $scope.feedbackGivenByTheUser[index]>5 ){
			alert("Please enter a number between 1-5");
			$scope.disablenextattributes = true;
			$scope.feedbackGivenByTheUser.splice(index,1);
			// console.log("Reached else if");
			return;
		}

		$scope.currCheck[$scope.pointer2]=true;

		$scope.disablenextattributes = false;

		var foundTeacher = _.find($scope.teacherFeedback, ['feedbackId', practicalTeacher.feedback_id]);
		
		
		if (foundTeacher) {
			if (foundTeacher.score[$scope.pointer2] == null) {
				foundTeacher.score.push($scope.feedbackGivenByTheUser[index]);
				
				//foundTeacher.score.push[$rootScope.pLength]=$scope.feedbackGivenByTheUser[index];
					//foundTeacher.score.push($scope.feedbackGivenByTheUser[index]);
				//foundTeacher.score.push[$rootScope.pLength]="";
					
				// localStorage.setItem("stringFeedback", JSON.stringify($scope.feedbackGivenByTheUser));
				// const data = JSON.parse(localStorage.getItem('stringFeedback');
				console.log(foundTeacher);
				console.log("Score : "+foundTeacher.score)
				console.log("Length : "+foundTeacher.score.length)
			} else {
				foundTeacher.score[$scope.pointer2] = $scope.feedbackGivenByTheUser[index];
			}
		} else {
			$scope.teacherFeedback.push({
				feedbackId: practicalTeacher.feedback_id,
				score: [$scope.feedbackGivenByTheUser[index]],
				type: 'Practical',
				subject_code: practicalTeacher.subject_code,
				instructor_code: practicalTeacher.instructor_code
			})
		}
		
		
	}

	$scope.increasePointer = function() {
		console.log('Feedbakc:',$scope.feedbackGivenByTheUser);
		localStorage.setItem('Feedback'+j, $scope.feedbackGivenByTheUser);
				j++;
		$scope.pointer += 1;
		console.log($scope.currCheck[$scope.pointer]);
		if($scope.currCheck[$scope.pointer]!=false && $scope.currCheck[$scope.pointer]!=undefined)
			$scope.disablenextattributes = false;	
		else $scope.disablenextattributes = true;
		
		for(var x=0;x<$scope.teacherFeedback.length;x++) {
			if ($scope.teacherFeedback[x].type=="Theory") {
				if(!$scope.teacherFeedback[x].score[$scope.pointer]) {
					for (var y=0;y<$scope.feedbackGivenByTheUser.length;y++ ) {
						$scope.feedbackGivenByTheUser[y] = null;
					}
				} else {
					for (var y=0;y<$scope.feedbackGivenByTheUser.length; y++ ) {
						$scope.feedbackGivenByTheUser[y] = $scope.teacherFeedback[y].score[$scope.pointer];
					}
				}
			}
		}
	}
	

	$scope.decreasePointer = function() {
		$scope.pointer -=1;
		$scope.disablenextattributes = false;
		$rootScope.tLength--;
		console.log("Practical decrease : "+$rootScope.tLength);
		var foundTeacher = $scope.teacherFeedback[$scope.pointer];

		for (var x=0; x<$scope.teacherFeedback.length;x++) {
			$scope.feedbackGivenByTheUser[x] = $scope.teacherFeedback[x].score[$scope.pointer];
		}
	}

	$scope.decreasePointer2 = function() {
		$scope.pointer2 -= 1;
		$scope.disablenextattributes = false;
		$rootScope.pLength--;
		var foundTeacher = $scope.teacherFeedback[$scope.pointer + $scope.pointer2];
		
		console.log("Theory decrease : "+$rootScope.tLength);
		
		console.log($scope.teacherFeedback);

		for (var x=0; x<$scope.teacherFeedback.length;x++) {
			if ($scope.teacherFeedback[x].type == "Practical") {
				$scope.feedbackGivenByTheUser[x] = $scope.teacherFeedback[x].score[$scope.pointer2];
			}
		}
	}

	$scope.switchPointer = function() {


		// for (var x =0;x<$scope.teacherFeedback.length;x++) {
		// 	var singleFeedbackLength = $scope.teacherFeedback[x].score.length;

		// 	console.log(singleFeedbackLength);

		// 	if (singleFeedbackLength !=15 && singleFeedbackLength !=0) {
		// 		alert('Some input fields are left missing please fill the input field!!');
		// 		//console.log("asd;lajsdlkjasdlaskd")
		// 		$scope.checkDisabled = false;
		// 		return;
		// 	}


		// }
		// for (var x=0; x< )
		$scope.disablenextattributes = true;
		console.log($scope.teacherFeedback);
		$scope.pointer2 += 1;
		$scope.currCheck=[];
	}

	$scope.logout = function() {
		userService.logout(function(response) {
			$location.path("/");
		});
		
	}

	$scope.increasePointer2 = function() {
		localStorage.setItem('Feedback'+j, $scope.feedbackGivenByTheUser);
		j++;
		$scope.pointer2 += 1;
		console.log($scope.currCheck);
		if($scope.currCheck[$scope.pointer2]!=false && $scope.currCheck[$scope.pointer2]!=undefined)
			$scope.disablenextattributes = false;	
		else $scope.disablenextattributes = true;
		
		for(var x=0;x<$scope.teacherFeedback.length;x++) {
			if ($scope.teacherFeedback[x].type=="Practical") {
				if(!$scope.teacherFeedback[x].score[$scope.pointer2]) {
					for (var y=0;y<$scope.feedbackGivenByTheUser.length;y++ ) {
						$scope.feedbackGivenByTheUser[y] = null;
					}
				} else {
					for (var y=0;y<$scope.feedbackGivenByTheUser.length; y++ ) {
						$scope.feedbackGivenByTheUser[y] = $scope.teacherFeedback[y].score[$scope.pointer2];
					}
				}
			}
		}
	}

	$scope.sendFeedbackEvaluation = function() {
		$scope.showSpinner=true;
		var object = {
			college_name: $scope.college_name,
			teacherFeedback: $scope.teacherFeedback,
			email: $scope.email,
			enrollment_no: 	$localStorage.userInfo.enrollment_no
		}

		console.log($scope.teacherFeedback);		//teacherFeedback.score
		userService.sendFeedbackForEvaluation(object, function(response,error) {
			if(response){
				$scope.showSpinner=false;
				console.log(response.message);
				alert(response.message);
				localStorage.clear();
				$location.path('/thankYouPage');
				
			}else if(error){
				console.log(error.message);
				alert(error.message);
				location.reload();
			}
			
			// if(response.data.config.data.teacherFeedback.length==0){
			// 	alert("Fill all the required entries in the form by logging in again");
			// 	$location.path('/');
			// 	return;
			// }else{
			// 	console.log(response);
			// 	alert("Feedback recorded");
			// 	$location.path("/thankYouPage");
			// 	$localStorage.clear();
			// }
		});
		

		
	}

	$scope.getInstructorsForFeedback();

	$scope.open = function() {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/instructions.html',
            scope: $scope,
            controller: 'SaveFilterCtrl',
            size: 'sm',
            animation: 'true',
            resolve: {}
        });

        modalInstance.result.then(function (selectedItem) {
            $log.info('Modal closed at: ' + new Date());
        }, function (selectedItem) {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

}]);


faculty.controller('SaveFilterCtrl', function ($uibModal, $uibModalInstance, $scope, $window, $sce, $route, $location, $localStorage, $http, $templateCache, userService) {

    $scope.dismiss = function() {
		$uibModalInstance.dismiss();
    };

});
/*
Digital modulation*/
