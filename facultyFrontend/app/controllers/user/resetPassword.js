faculty.controller('resetPasswordCtrl' ,['$route','$scope','$http', '$window', '$rootScope', '$location','resetService',function($route,$scope, $http, $window,$rootScope, $location, resetService){
    $scope.check=0; 
    $scope.disableGif1=true;
    $scope.disableGif2=true;
    $scope.secondSect=false;

    $scope.disableSentEmail = false;
    $scope.item={};

    $scope.fieldTouch=[false,false,false,false];
    // init autocomplete
    $http({
        method:"GET",
        url:BACKEND+"/getTeacher",
    })
    .then(function(res){
        var data=res.data;
        $(document).ready(function(){
            var data_val={};

            data.forEach(function(val){
                data_val[`${val.name} - ${val.instructor_id}`]=null;
                $('input#instructor_name').autocomplete({
                    data:data_val         
                });
            })
            
        });
    },function(err){
        console.log(err);   
    })  
    
    
    $scope.changeFlag = function(info) {
        if(info==undefined){return};
        var infoParsed = info.split(' - ');
        $scope.info = infoParsed[0];
        $scope.item.instructor_id = infoParsed[1];
       
	}
    
//Verify Email    
     $scope.getEmail = function(item){
       // $scope.disableSentEmail = true;
         $scope.disableGif1=false;
         resetService.getEmail(item.instructor_id,(res,err)=>{
            if(err){console.log(err);return;}
            
            if(res.data.response=='sentMail'){
                $scope.disableGif1=true;
                $scope.secondSect=true; 
                var hider = "x";
                var masked = res.data.email.replace(res.data.email.substring(3, res.data.email.indexOf('@')), hider.repeat(res.data.email.substring(3, res.data.email.indexOf('@')).length));
                alert("OTP sent to registered email id : " + masked);
            }
            else if(res.data.response=="noEmail") {
                $scope.disableGif1=true;
                alert("No registered email id for "+ res.data.name + ". Please contact us at sdcusict@ipu.ac.in for help.");
                location.reload();
            }
            else {
                $scope.disableGif1=true;
                alert("Server Failure. Please try again");
                location.reload();
            }
         })
         
        
     }

    $scope.checkPassword = function() {
        if($scope.item.instructor_newPassword == $scope.item.instructor_newRepeatPassword) {
            return;
        }
        else {
            alert("Passwords do not match. Please try again");
            $scope.item.instructor_newPassword = "";
            $scope.item.instructor_newRepeatPassword = "";
        }
    }
//Reset Password   
    $scope.resetPassword = function(item){
        //$scope.disableNewPassword = false;
        //append new password
        $scope.disableGif2=false;
        console.log(item);
        resetService.resetPassword(item.instructor_id,item.instructor_otp,item.instructor_newPassword,function(res,err){
            if(err){console.log(err);return;}

            if(res.data.response=="reset"){
                $scope.disableGif2=true;
                alert("Password changed successfully");
                $location.path("/")
            }

            else if(res.data.response=='expire') {
                $scope.disableGif2=true;
                alert("OTP has expired. Please try again");
                location.reload();
            }

            else if(res.data.response=='wrongOTP') {
                $scope.disableGif2=true;
                alert("Wrong OTP. Please try again");
                item.instructor_otp = "";
            }

            else {
                $scope.disableGif2=true;
                alert("Server Failure. Please try again");
                location.reload();
            }  
        })
        return;
    }
}]);

