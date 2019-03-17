faculty.controller("deanCtrl", function($scope, $rootScope, $location, facultyService) {
	$scope.dean  = [];
	$scope.editCollege=$scope.editRoom=$scope.editDoj=$scope.editEmail=$scope.editPhone=$scope.editName=true;
	$scope.fieldTouch=[false,false,false,false];
	
	$scope.getDetails = function() {
		console.log('Get Details');
		facultyService.getDetails(function(response) {
			response.date_of_joining=response.date_of_joining.split('T')[0];
			console.log(response);
			$scope.dean = response;
		})

	}
	$scope.checkStatus = function() {
		$location.path("/deanAnalysis");

	}

	$scope.logout = function(req,res) {
		facultyService.logout(function(response) {		
			if(response){
				$location.path("/");
				alert(response.message);
			}
		})
	}

	$scope.updateDeanInfo=function(){
		
		facultyService.updateDeanInfo($scope.dean,function(err,resp){
			if(err){
				alert(err.message);
				return;
			}
			alert(resp.message);
		})
	}

	$scope.getDetails();
})
