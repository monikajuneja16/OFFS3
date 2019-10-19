faculty.controller("pvcAnalysisCtrl", function($scope, $rootScope, $location, pvcService) {

	$scope.pvc = [];
	$scope.viewElements = false;
	$scope.selectedYear = '2019';
	$scope.year = 'August 2019 - May 2020';
	$scope.selected = {};
	$scope.progress = false;
	$scope.searching = false;
	$scope.searched = false;
	$scope.disabled = true;

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

		{collegeName :"University School of Humanities and Soc Sciences",
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

	$scope.getFeedback = function() {

		pvcService.getFeedback($scope.selectedSchool, $scope.selectedYear, function(error,response) {

			if(error){
				//console.log(error.message);
				alert(error.message);
				$scope.selectedYear="";
				$scope.progress = false;
				$scope.viewElements = true;
				return;
			
			}
			$scope.viewElements = true;
			$scope.pvcfb = response;

			//get unique teachers
			$scope.teacherlist = _.chain($scope.pvcfb).pluck('name').uniq().value().sort();
			$scope.subjects = _.chain($scope.pvcfb).pluck('subject_name').uniq().value();
			$scope.course = _.chain($scope.pvcfb).pluck('course').uniq().value();

			/*if($scope.course.length==0){
				alert(`Feedback not given by any student for ${$scope.selectedSchool.collegeCode.toUpperCase()} for the period of ${$scope.selectedYear}`);
				$scope.selectedYear="";
				$scope.progress = false;
				$scope.viewElements = true;
				return;
			}*/

			//for BTECH MTECH problem
			$scope.bmtech=['B. TECH','M. TECH'];
			$scope.course=$scope.course.map((course)=>{
				if(course=='MTECH'){
					$scope.bmtech[1]=course;
					return 'M. TECH'
				}else if(course=='BTECH'){
					$scope.bmtech[0]=course;
					return 'B. TECH'
				}else{
					return course;
				}
			})

			$scope.stream = _.chain($scope.pvcfb).pluck('stream').uniq().value();
			$scope.semester = _.chain($scope.pvcfb).pluck('semester').uniq().value();

			// init all selects
			$(document).ready(function () {
				$('select').material_select();
			})

			$scope.progress = false;

		})
	}

	$scope.yearChange = function () {
		$scope.selectedYear = $scope.year.slice(7,11);
		$scope.final_res = {};
		console.log('changed');
		if($scope.selectedSchool) {
			//hide stuff
			$scope.viewElements = false;
			// show preloader
			$scope.progress = true;
			$scope.getFeedback();
		}
	}


	$scope.teacherList = function(Sem, Course, Streams) {

		var arr = [3];
		arr[0] = {semester: Sem}
		arr[1] =  {course: Course}

		//Only to resolve MTECH and BTECH problem aaawwww!!!
		if(arr[1].course=='B. TECH' && $scope.bmtech[0]=='BTECH'){arr[1].course=$scope.bmtech[0];}
		else if(arr[1].course=='M. TECH' && $scope.bmtech[1]=='MTECH'){arr[1].course=$scope.bmtech[1];}

		arr[2] = {stream: Streams}
		console.log(arr[0]);

		var teacherWithDetails = _.clone($scope.pvcfb);

		for (var x =0;x<arr.length;x++) {
			var key = Object.keys(arr[x]);
			var val = key[0];
			console.log(val)
			console.log(arr[x][key[0]]);
			if (arr[x][key[0]] !=undefined){
				teacherWithDetails = _.where(teacherWithDetails, { [val]: arr[x][key[0]]  } )
			}

		}

		// var teacherWithDetails = _.where($scope.pvcfb, {semester:null});
		$scope.teacherlist =  _.chain(teacherWithDetails).pluck('name').uniq().value().sort();
		console.log($scope.teacherList);

		$(document).ready(function () {
			$('select').material_select();
		})
	}

	$scope.subjectLists = function(Sem, Course, Streams, Teacher) {
		var arr = [4];
		arr[0] = { semester: Sem }
		arr[1] = { course: Course }
		arr[2] = { stream: Streams }
		arr[3] = { name: Teacher }

		//Only to resolve MTECH and BTECH problem aaawwww!!!
		if(arr[1].course=='B. TECH' && $scope.bmtech[0]=='BTECH'){arr[1].course=$scope.bmtech[0];}
		else if(arr[1].course=='M. TECH' && $scope.bmtech[1]=='MTECH'){arr[1].course=$scope.bmtech[1];}

		var	subjectDetails = _.clone($scope.pvcfb);

		for (var x =0;x<arr.length;x++) {
			var key = Object.keys(arr[x]);
			var val = key[0];
			if (arr[x][key[0]] !=undefined){
				subjectDetails = _.where(subjectDetails, { [val]: arr[x][key[0]]  } )
			}

		}

		$scope.subjects =  _.chain(subjectDetails).pluck('subject_name').uniq().value().sort();

		$(document).ready(function () {
			$('select').material_select();
		})
	}

$scope.logout = function(req,res) {
		pvcService.logout(function(response) {
			
		})
		$location.path("/");
	}

$scope.print = function (){
	
                var content_vlue = document.getElementById('mycanvas').outerHTML;
    var htmlToPrint = '' +
        '<style type="text/css">' +
        'table th, table td {' +
        'border:1px solid #000;' +
        'padding;0.5em;' +
        'font-size:19px;' +
        '}' +
        
        '</style>';
   content_vlue += htmlToPrint
  var docprint=window.open("");
 
   docprint.document.write('<head><title>feedback</title>');
   docprint.document.write('<style type="text/css">body{ margin:0px;');
   docprint.document.write('font-family:Verdana, Geneva, sans-serif; font-size:12px;}');
   docprint.document.write('.inforow{display:flex;}');
   docprint.document.write('.infoelement{flex:1; text-align:center; margin:10px;}');
   docprint.document.write('.large-title {font-weight: 700;font-size: 16px;color: darkcyan;');
   docprint.document.write('letter-spacing: 0.1em;text-transform: uppercase;padding: 0.5em;}');
   docprint.document.write('.pct {font-size: 24px; font-weight: 700;}');
   docprint.document.write('.small-title {font-weight: 700;font-size: 14px;color: darkcyan;letter-spacing: 0.1em;text-transform: uppercase;}');
   docprint.document.write(' </style>');
   docprint.document.write('</head><body onLoad="self.print()"><center><h1><u>Feedback Report</u></h1>');
   docprint.document.write(content_vlue);
   docprint.document.write('</center></body></html>');
   docprint.print();
   docprint.close();
  
}
    


	$scope.streamList = function(course) {
		if (!course) {
			return;
		}

		var StreamDetails = _.where($scope.pvcfb, {course:course});
		console.log(StreamDetails);
		$scope.stream =  _.chain(StreamDetails).pluck('stream').uniq().value().sort();

		$(document).ready(function () {
			$('select').material_select();
		})
	}




	$scope.schoolChange = function () {
		$scope.final_res = {}
		if ($scope.selectedYear) {
			// hide it
			$scope.viewElements = false;
			// show preloader
			$scope.progress = true;
			$scope.getFeedback();
		}
	}

	$rootScope.attributesList = {
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

	$scope.updateSubjects = function () {

	}
	$scope.t = function () {
		console.log($scope.selected.Teacher);
	}
	$scope.search  = function (selectedCourse, selectedStream, selectedSem, selectedTeacher, selectedSubject) {

		console.log($scope.pvcfb);

		$scope.searching = true;		
		var course = selectedCourse;
		var sem = selectedSem;
		var stream = selectedStream;
		var subject = selectedSubject;
		var teacher = selectedTeacher;

		mdict = {}
		if (teacher != null || teacher != undefined) {
				mdict['name'] = teacher
		}

		if ( course != null || course != undefined) {
			mdict['course'] = course
		}

		if ( sem != null || sem != undefined) {
			mdict['semester'] = sem
		}

		if ( stream != null || stream != undefined) {
			mdict['stream'] = stream
		}

		if ( subject != null || subject != undefined) {
			mdict['subject_name'] = subject
		}

		console.log(mdict)
		var final_res = _.where($scope.pvcfb, mdict);

		console.log(final_res)
  // One Time Preprocessing

		final_res.forEach(function (val) {
			if (!_.isObject(val['at_1']) && _.isString(val['at_1'])) {


			if (val['at_15'].length!=1) {
				val.type="Theory"
			} else {
				val.type="Practical"
			}


			if(val.type=="Theory") {
				var atts = []
				for (var i = 0; i < 15; i++) {
					atts.push('at_' + (+i+1));
				}
			} else {
				var atts = []
				for (var i = 0; i < 8; i++) {
					atts.push('at_' + (+i+1));
				}
			}
		//	console.log(val)
			//console.log(atts);
				atts.forEach(function (att) {
					val[att] = val[att].split('');

					val[att].shift();

					tmp = {
						1: 0,
						2: 0,
						3: 0,
						4: 0,
						5: 0
					}
					val[att].forEach(function (v) {
						tmp[+v]++;
					});

					val[att] = tmp;
				})
			}
		});

		$scope.searching = false;
		$scope.searched = true;

		if (final_res.length == 0) {
			$scope.final_res = null;
			alert("No feedback data exists");
			$scope.disabled =true;
		}

		else {
			$scope.final_res = final_res;
			$scope.disabled = false;
		}

	//		console.log(final_res);


	}

 $scope.getTotal = function (value) {
 	sum = 0
 	sarr = []
 		if(value.type=='Theory') {
 			k = 15;
 			 }
 			 else {
 				k=8;

 		}

 		for (var i = 0; i < k; i++) {
 				sarr.push(value['at_' + (+i+1)]['1']*1 + value['at_' + (+i+1)]['2']*2 +
                    value['at_' + (+i+1)]['3']*3 + value['at_' + (+i+1)]['4']*4  +
                value['at_' + (+i+1)]['5']*5)
 			}

 			return sarr.reduce(function (v,a) {
 				return v+a;
 			})
 }

	$scope.getDetails = function() {
		pvcService.getDetails(function(response) {
			$scope.pvc = response;
			console.log($scope.pvc);
		})
	}


})
