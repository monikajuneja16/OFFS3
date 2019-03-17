faculty.controller('dataStatusCtrl',['$http','$scope','dataPortalService', 'dataStatusService', '$location','$window',function($http, $scope, dataPortalService, dataStatusService, $location, $window){

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
    
        $scope.courseList = [];
    
        $scope.searchedSubjectData = false;

        $scope.selectedData = null;

        $scope.stream = [];
        var data_value  = {};

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
                        $scope.courseList = responce;
                    $(document).ready(function () {
                        $('select').material_select();
                    })
    
                    }
                })
    
            }
        }

        $scope.searchSubjectDataStatus = function() {
            $scope.searchedSubjectData = true;
                dataStatusService.getSubjectDataStatus($scope.collegeCode, function(response) {
                    if (response == "400") {
                        alert("something wrong happened")
                        $location.path("/dataStatus");  
                    }
                    else {
                        $scope.selectedData = response;
                        for(var i=0; i<$scope.selectedData.data.length; ++i) {
                            $scope.selectedData.data[i].flag = 0;
                        }
                        for(var i=0; i<$scope.selectedData.noData.length; ++i) {
                            $scope.selectedData.noData[i].flag = 1;
                        }
                    }
                })
        }
    }])
