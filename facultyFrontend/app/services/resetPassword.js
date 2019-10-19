faculty.factory('resetService',['$http', '$timeout', '$rootScope','$window','$location', function($http, $timeout, $rootScope,$window,$location){
	
	return {
		
		getInstructor: function(){
							$http({
								method:"GET",
								url:BACKEND+"/getTeacher",
							})
							.then(function(res){
								//console.log(res.data);
								var data=res.data;
								$(document).ready(function(){
									console.log(data.length);
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
						},


		getEmail:	function(instructor_id,callback){
						$http({
							method:"POST",
							url:BACKEND+'/resetpassword',
							data:{
								instructor_id:instructor_id,
							}
						})
						.then(function(res){
							callback(res);
						},(err)=>{
							callback(err);
						})


						
					},

		resetPassword:		function(instructor_id,otp,password,callback){
								$http({
									method:"POST",
									url:BACKEND+'/resetpassword/otp',
									data:{
										instructor_id:instructor_id,
										resetVar: otp,
										password:password,
									}
								})
								.then((res)=>{
									callback(res);
								},(err)=>{
									callback(undefined,err);
								})
							}


    }	
}])
