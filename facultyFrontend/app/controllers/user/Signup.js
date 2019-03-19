faculty.controller('SignupCtrl',['$scope','$http', '$rootScope', '$location', 'userService', 'facultyService', 'vcService', 'pvcService', 'teacherService','$localStorage','$window',function($scope, $http, $rootScope, $location, userService, facultyService, vcService, pvcService, teacherService,$localStorage,$window) {
  $scope.user = {};  
  $scope.name = "";
  $scope.user.category='student';
  $scope.displayed = 'Student';
  $scope.fieldTouch=[false,false,false,false];
  
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
  
  
  var autocomp=false;

  var autocompleteFields=function(school,category){
    
    if(!autocomp){
      if(category=='Teacher' && (school!="" ||school!=undefined) ){
        console.log(school+"  =  "+category);
        $http({
          method:"GET",
          url:BACKEND+"/tgetTeacherData",
          params:{
            school: school,
            designation:category
          }
        })
        .then(function(res){
            var data=res.data;
            console.log(data[0]);
            $(document).ready(function(){
              
                var data_val={};

                $('input#userName').autocomplete({
                  data:data_val         
                });

                data.forEach(function(val){
                    data_val[`${val.name} - ${val.instructor_id}`]=null;
                    $('input#userName').autocomplete({
                        data:data_val         
                    });
                })

               // console.log($('input#userName')[0]);
                
            });
        },function(err){
            console.log(err);   
        })  
      }
      else if(category=='Dean' && (school!="" ||school!=undefined) ) {
        $http({
          method:"GET",
          url:BACKEND+"/tgetTeacherData",
          params:{
            school: school,
            designation:category
          }
        })
        .then(function(res){
            $scope.user.name = res.data[0].name;
            $scope.user.rollno = res.data[0].instructor_id;
        },function(err){
            console.log(err);   
        })
      }
      else if(category=='VC' || category=='Pro VC') {
        $http({
          method:"GET",
          url:BACKEND+"/tgetTeacherData",
          params:{
            school: school,
            designation:category
          }
        })
        .then(function(res){
            $scope.user.name = res.data[0].name;
            $scope.user.rollno = res.data[0].instructor_id;
        },function(err){
            console.log(err);   
        })
      }
      autocomp=true;
  }
}

  $scope.userCategoryList = ["Vice Chancellor", "Pro Vice Chancellor", "Dean", "Teacher", "Student"];

  $scope.setCollege = function(singleCollege) {
    $scope.college = singleCollege;
    var scul=$scope.college.collegeCode;
    console.log(scul);
    $localStorage.college = singleCollege;
    autocomp=!autocomp;
    autocompleteFields(scul,$scope.user.category);
  };


  $scope.setUserCategory = function(userCategory) {
    $scope.user.name = "";
    $scope.user.rollno = "";
    console.log(userCategory);
    $scope.displayed = userCategory;
    if(userCategory == 'Student') {
      $scope.user.category = 'student';
    }
    else if(userCategory == 'Vice Chancellor') {
      $scope.user.category = 'VC';
    }
    else if(userCategory == 'Pro Vice Chancellor') {
      $scope.user.category = 'Pro VC';
    }
    else {
      $scope.user.category = userCategory;
    }

    if ($scope.user.category == 'VC' || $scope.user.category == 'Pro VC' && ($scope.college==undefined || $scope.college=="")) {
      var checker = 
      {
        collegeName: "University School of Info.,Comm. and Technology",
        collegeCode: "usict"
      }
      $scope.setCollege(checker);
    }

    scul=$scope.college.collegeCode;
    autocomp=!autocomp;
    autocompleteFields(scul,$scope.user.category);
    
    //to be disabled later
   // $scope.user.category='student';
  };

  $scope.findSemister = function() {
    console.log("Roll : "+typeof $scope.user.rollno);
    var roll = (_.clone($scope.user.rollno)).toString();
    
    //var roll=$scope.user.rollno;
    var year = parseInt(roll.substring(roll.length - 2, roll.length));
    
    /*if(year == 13 || year == 14) {
      console.log(typeof(year));
      year = year + 4;
    } */  
    $scope.user.semister = (18 - year) * 2 + 1;
    
    //for students with more than 8 sems MTECH
    if($scope.user.semister>8){
      $scope.user.semister-=8;
    }

    if($scope.user.semister>8 || $scope.user.semister<1){
      $scope.user.semister='---';
    }
    $localStorage.semester = $scope.user.semister;
    console.log($scope.user.semister);
    
  };

  $scope.updateSemester = function() {
   /* var decimal=  /^[-+]?[0-9]+\.[0-9]+$/; 
    if($scope.user.semister.match(decimal)) {
      alert("Please enter an integer");
      $scope.user.semister = "";
    }
    else {
      if ($scope.user.semister%2 == 0 || $scope.user.semister>8 || $scope.user.semister<1 || !angular.isNumber(parseInt($scope.user.semister))) {
        $scope.user.semister = "";
        alert("Kindly fill the correct semester");
      }
      else {*/
        $localStorage.semester = $scope.user.semister;
        $scope.disablebtn = false;
      /*}
      }*/
  };

  $scope.getNameId=function(info){
    console.log(info)
    if(info==undefined){return};
        var infoParsed = info.split(' - ');
        $scope.user.name = infoParsed[0];
        $scope.user.rollno = infoParsed[1];
        
  }

  $scope.LoginUser = function() {
    $scope.hidebutton = true;
    $scope.showSpinner = true;

    console.log(`data : ${$scope.college}, ${$scope.user.category}, ${$scope.user.rollno}, ${$scope.user.email}`)
    if ($scope.college==undefined || $scope.college=="" || $scope.user.category==undefined || $scope.user.category=="" || $scope.user.rollno==undefined || $scope.user.rollno=="" /*|| $scope.user.email==undefined*/ || $scope.user.email=="") {
      alert("Fill all the fields of the form");
      $scope.hidebutton = false;
      $scope.showSpinner = false;
      return;
      
    }

      console.log($scope.college, $scope.user);
      if ($scope.user.category == "Dean") {
        facultyService.send_details(
          $scope.college.collegeCode,
          $scope.user,
          function(response) {
            if (response.status == 400) {
              alert(response.message);
              $location.path("/");
              $scope.hidebutton = false;
              $scope.showSpinner = false;
            } else {
              $location.path("/deanDashboard");
            }
          }
        );
      } else if ($scope.user.category == "Teacher") {
        teacherService.send_details(
          $scope.college.collegeCode,
          $scope.user,
          function(response) {
            if (response.status == 400) {
              alert(response.message);
              $location.path("/");
              $scope.hidebutton = false;
              $scope.showSpinner = false;

            } else {
              $localStorage.teacher = response.teacher;
              console.log($localStorage.teacher);
              $location.path("/teacherDashboard");
            }
          }
        );
      } else if ($scope.user.category == "VC") {
        vcService.send_details(
          $scope.college.collegeCode,
          $scope.user,
          function(response) {
            if (response.status == 400) {
              alert(response.message);
              $location.path("/");
              $scope.hidebutton = false;
              $scope.showSpinner = false;
            } else {
              $location.path("/vcDashboard");
            }
          }
        );
      } else if ($scope.user.category == "Pro VC") {
        pvcService.send_details(
          $scope.college.collegeCode,
          $scope.user,
          function(response) {
            if (response.status == 400) {
              alert(response.message);
              $scope.hidebutton = false;
              $scope.showSpinner = false;
              $location.path("/");
            } else {
              $location.path("/pvcDashboard");
            }
          }
        );
      } else {
        console.log($scope.user);
        userService.send_details(
          $scope.college.collegeCode,
          $scope.user,
          function(response) {
            if (response == 400) {
              $scope.hidebutton = false;
              $scope.showSpinner = false;
              $location.path("/");
            } else if (response.message) {
              alert(response.message);
              $scope.college="";
              $scope.user.category="student";
              $scope.user.rollno="";
              $scope.user.email="";
              $scope.user.semister="";
              $scope.showSpinner=false;
              $scope.hidebutton=false;
            } else {
              $localStorage.tablename =
                $scope.college.collegeCode + "_" + $scope.user.category;
              $localStorage.rollno = $scope.user.rollno;
              console.log($localStorage);
              $location.path("/verify");
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
    var tablename = $localStorage.tablename;
    var rollno = $localStorage.rollno;
    console.log($localStorage.tablename);

    userService.verifyUser(
      $scope.otp,
      tablename,
      rollno,
      $localStorage.semester,
      function(response) {
        console.log(response)
        if (response.err == 'wrongpass') {
          alert("Wrong OTP. Please try again.");
          $location.path("/verify");
        } else {
         // console.log("Response : "+JSON.stringify(response,null,2));
          $localStorage.userDetails = response;
          console.log($localStorage.userDetails);
          $location.path("/dashboard");
        }
      }
    );
  };
}]);
