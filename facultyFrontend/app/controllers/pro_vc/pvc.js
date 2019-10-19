faculty.controller("pvcCtrl", function($scope, $rootScope, $location,$localStorage, pvcService) {
	$scope.pvc  = [];
	$scope.editName=$scope.editDoj=$scope.editEmail=$scope.editPhone=$scope.editRoom=$scope.editName=true;
	$scope.fieldTouch=[false,false,false,false];

	$scope.getDetails = function() {
	console.log('Get Details');
	pvcService.getDetails(function(response) {
		//esponse.date_of_joining=response.date_of_joining.split('T')[0];
		response.date_of_joining=response.date_of_joining.split('T')[0];
			console.log(response);
			$scope.pvc = response;
		})
	}

	$scope.checkStatus = function() {
		$location.path("/pvcAnalysis");
	}

	$scope.logout = function(req,res) {
		pvcService.logout(function(response){		
			if(response){
				$location.path("/");
				alert(response.message);
			}
		})
	}	
			
	$scope.updatePvcInfo=function(){	
		//console.log($scope.teacher);
		pvcService.updatePvcInfo($scope.pvc,function(resp){
			alert(resp.message);	
		})
	}

	$scope.getDetails();

	
})
