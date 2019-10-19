faculty.controller("vcCtrl",function($scope, $rootScope, $location,$localStorage, vcService) {
	$scope.vc  = [];
	$scope.editName=$scope.editDoj=$scope.editEmail=$scope.editPhone=$scope.editRoom=$scope.editName=true;
	$scope.fieldTouch=[false,false,false,false];

	$scope.getDetails = function() {
	console.log('Get Details');
	vcService.getDetails(function(response) {
		//esponse.date_of_joining=response.date_of_joining.split('T')[0];
		response.date_of_joining=response.date_of_joining.split('T')[0];
			console.log(response);
			$scope.vc = response;
		});
	}

	$scope.logout = function(req,res) {
		vcService.logout(function(response){		
			if(response){
				$location.path("/");
				alert(response.message);
			}
		})
	}	
	
	$scope.updateVcInfo=function(){	
		//console.log($scope.teacher);
		vcService.updateVcInfo($scope.vc,function(resp){
			alert(resp.message);	
		})
	}


  $scope.checkStatus = function() {
    $location.path("/vcAnalysis");
  }

  $scope.getDetails();

 
});
