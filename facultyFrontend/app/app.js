window.faculty = angular.module('faculty', ["ngStorage",'ngAnimate', 'ngRoute', 'ui.bootstrap'])
.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
        .when('/', {
            controller: 'SignupCtrl',
            templateUrl: './app/templates/user/Signup.html'
        })
        .when('/verify', {
        	controller: 'SignupCtrl',
        	templateUrl: './app/templates/user/verify.html'
        })
        .when('/dashboard', {
        	controller: 'dashboardCtrl',
        	templateUrl: './app/templates/user/dashboard.html'
        })
        .when('/userFeedback', {
            controller: 'feedbackCtrl',
            templateUrl: './app/templates/user/userFeedback.html'
        })
        .when('/status', {
            controller: 'notGivenFeedbackCtrl',
            templateUrl: './app/templates/user/notGivenFeedback.html'
        })
        .when('/deanDashboard', {
            controller: 'deanCtrl',
            templateUrl: './app/templates/dean/deanDashboard.html'
        })
        .when("/deanAnalysis", {
            controller: 'deanAnalysisCtrl',
            templateUrl: './app/templates/dean/dean_analysis.html'
        })
        .when('/vcDashboard', {
            controller: 'vcCtrl',
            templateUrl: './app/templates/vc/vcDashboard.html'
        })
        .when("/vcAnalysis", {
            controller: 'vcAnalysisCtrl',
            templateUrl: './app/templates/vc/vc_analysis.html'
        })
        .when('/pvcDashboard', {
            controller: 'pvcCtrl',
            templateUrl: './app/templates/pro_vc/pvcDashboard.html'
        })
        .when('/pvcAnalysis', {
            controller: 'pvcAnalysisCtrl',
            templateUrl: './app/templates/pro_vc/pvc_analysis.html'
        })
        .when('/teacherDashboard', {
            controller: 'tCtrl',
            templateUrl: './app/templates/teacher/teacherDashboard.html'
        })
        .when('/teacherAnalysis', {
            controller: 'tAnalysisCtrl',
            templateUrl: './app/templates/teacher/teacher_analysis.html'
        })
        .when('/thankYouPage', {
            templateUrl: './app/templates/user/thankYouPage.html'
        })
        .when('/dataPortal', {
            controller: 'dataPortalCtrl',
            templateUrl: './app/templates/dataPortal/dataPortal.html'
        })
        .when('/studentData', {
            controller: 'studentDataCtrl',
            templateUrl: './app/templates/studentData/studentData.html'
        })
        .when('/dataStatus',{
            controller:'dataStatusCtrl',
            templateUrl: './app/templates/user/dataStatus.html'
        })
        .when('/resetPassword',{
            controller:'resetPasswordCtrl',
            templateUrl:'./app/templates/resetPassword.html'
        })
        .when('/newTeacher',{
            controller:'newTeacherCtrl',
            templateUrl:'./app/templates/teacher/newTeacher.html'
        })

    }
]);


faculty.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);