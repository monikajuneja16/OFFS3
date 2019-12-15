faculty.controller("deanAnalysisCtrl", function($scope, $rootScope, $location, $localStorage, facultyService) {
	
	

	$scope.dean = [];
	$scope.selectedYear = '2019';
	$scope.year = 'August 2019 - May 2020';
	$scope.searching = false;
	$scope.searched = false;
	$scope.disabled = true;
	$scope.selectedTabIndex=0;
	$scope.showAnalysis=false;


	$(".tabs").on("click",'a',function(){
		setTimeout(function(){
			let index=Number($("ul.tabs a.active").attr("href").substr(4))-1;
			$scope.selectedTabIndex= index;
		},50)
	})

	
	$scope.years=[
		'August 2016 - May 2017',
		'August 2017 - May 2018',
		'August 2018 - May 2019',
		'August 2019 - May 2020'
	];

	$scope.analysis={
		college:$localStorage.college.collegeCode,
		selectedYear:$scope.selectedYear,
		showYear:$scope.years[$scope.years.length-1],
		courses:[],
		streams:[]
	}

	$scope.getFeedback = function() {
		console.log($localStorage);

		facultyService.getFeedback($localStorage.college.collegeCode, $scope.selectedYear, function(response) {
			$scope.deanfb = response;
			
			//get unique teachers
			$scope.teacherlist = _.chain($scope.deanfb).pluck('name').uniq().value().sort();
			$scope.subjects = _.chain($scope.deanfb).pluck('subject_name').uniq().value();
			$scope.course = _.chain($scope.deanfb).pluck('course').uniq().value();
			
			$scope.stream = _.chain($scope.deanfb).pluck('stream').uniq().value();
			$scope.analysis={
				...$scope.analysis,
				course:$scope.course,
				stream:$scope.stream,	
			}

			$scope.semester = _.chain($scope.deanfb).pluck('semester').uniq().value();

			// init all selects
			$(document).ready(function () {
				$('select').material_select();
			})


		})
	}

	

	$scope.teacherList = function() {
		var arr = [3];
		 arr[0] = {semester: $scope.selectedSem}
		 arr[1] =  {course: $scope.selectedCourse}
		arr[2] = {stream: $scope.selectedStream}

	
		var teacherWithDetails = _.clone($scope.deanfb);

		for (var x =0;x<arr.length;x++) {
			var key = Object.keys(arr[x]);
			var val = key[0];
			console.log(val)
			console.log(arr[x][key[0]]);
			if (arr[x][key[0]] !=undefined){
				teacherWithDetails = _.where(teacherWithDetails, { [val]: arr[x][key[0]]  } )
			}
			 
		}

		// var teacherWithDetails = _.where($scope.deanfb, {semester:null});
		$scope.teacherlist =  _.chain(teacherWithDetails).pluck('name').uniq().value().sort();
		
		$(document).ready(function () {
			$('select').material_select();
		})
	}

	$scope.subjectLists = function() {
		var arr = [4];
		arr[0] = {semester: $scope.selectedSem}
		arr[1] = {course: $scope.selectedCourse}
		arr[2] = {stream: $scope.selectedStream}
		arr[3] = {name: $scope.selectedTeacher}

		var	subjectDetails = _.clone($scope.deanfb);
		console.log(subjectDetails);

		for (var x =0;x<arr.length;x++) {
			var key = Object.keys(arr[x]);
			var val = key[0];
			if (arr[x][key[0]] !=undefined){
				subjectDetails = _.where(subjectDetails, { [val]: arr[x][key[0]]  } )
			}
			 
		}
        console.log(subjectDetails);
		$scope.subjects =  _.chain(subjectDetails).pluck('subject_name').uniq().value().sort();

		$(document).ready(function () {
			$('select').material_select();
		})
	}



	$scope.streamList = function() {
		var course = $scope.selectedCourse;
		

		var StreamDetails = _.where($scope.deanfb, {course:course});
		let streams =  _.chain(StreamDetails).pluck('stream').uniq().value().sort();
		
		
		$scope.stream=streams;
		
		console.log($scope.analysis);
		
		$(document).ready(function () {
			$('select').material_select();
		})
	}



	// $scope.getSubjects = function() {
	// 	var teacher = 

	// }

	$scope.yearChange = function () {
		let selectedYear=$scope.year.slice(7,11);
		
		$scope.selectedYear=selectedYear;
		$scope.getFeedback();
	}


	$scope.yearChangeA = function () {
		let selectedYear=$scope.analysis.showYear.slice(7,11);
		$scope.analysis.selectedYear=selectedYear;
	}

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
			"The teacher helped you build your capability to think and plan the experiments independently and analyze the results critically",
			"Encourages and makes you feel comfortable about asking questions.",
			"Provides enthusiastic, clear and satisfactory response to student s questions."
		]

	}

	$scope.updateSubjects = function () {

	}

	$scope.logout = function(req,res) {
		facultyService.logout(function(response) {
			
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
        'font-size:19.35px;' +
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


$scope.printAnalysis = function (){	 
	var content_vlue = document.getElementById('analysisCanvas').outerHTML;
	 var htmlToPrint = '' +
		 '<style type="text/css">' +
		 'table th, table td {' +
		 'padding:0.5em;border-spacing:0;'+
		 'border:1px solid #000;' +
		 'font-size:19.35px;}' +
		 '</style>';
	content_vlue += htmlToPrint
   var docprint=window.open("");
  
	docprint.document.write('<head><title>Feedback Analysis</title>');
	docprint.document.write('<style type="text/css">body{ margin:0px;');
	docprint.document.write('font-family:Verdana, Geneva, sans-serif; font-size:12px;}');
	docprint.document.write(' </style>');
	docprint.document.write(`</head><body onLoad="self.print()"><center><h2><u>Feedback Report - ${$localStorage.college.collegeCode.toUpperCase()}, ${CURR_YEAR}-${CURR_YEAR+1}, ${ODD_EVEN%2 ? 'Odd semester':'Even semester'}</u></h2>`); 
	docprint.document.write(content_vlue);
	docprint.document.write('</center></body></html>');
	docprint.print();
	docprint.close();
 }
    
   

	$scope.search  = function () {

		console.log($scope.deanfb);

		$scope.searching = true;
		var course = $scope.selectedCourse;
		var sem = $scope.selectedSem;
		var stream = $scope.selectedStream;
		var subject = $scope.selectedSubject;
		var teacher = $scope.selectedTeacher;



		console.log(sem)
		console.log(course)
		console.log(stream)
		console.log(subject)
		console.log(teacher)
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

		var final_res = _.where($scope.deanfb, mdict);

  // One Time Preprocessing

		final_res.forEach(function (val) {
			if (!_.isObject(val['at_1']) && _.isString(val['at_1'])) {


			if (val['at_15'].length!=1) {
				val.type="Theory"
			} else {
				val.type="Practical"
			}

			if(val.course=='BTECH'){
				val.course='B. TECH';
			}else if(val.course=='MTECH'){
				val.course='M. TECH';
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

			console.log(final_res);


	}

 $scope.getTotal = function (value) {
 	console.log(value);
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
		facultyService.getDetails(function(response) {
			$scope.dean = response;
			console.log($scope.dean);
		})
	}



	// Feedback analysis


	$scope.analysisUtility=async function(payload){
		return Promise.all(payload.map(async ({course,stream,semester})=>{
			let year='20'+(Number($scope.analysis.selectedYear.toString().substring(2)) - Math.floor(semester/2.1));
			
			let data=await facultyService.getBatchData(
				$scope.analysis.college,year,
				course,stream,semester
			)

			data={
				college:$scope.analysis.college,
				year,studentData:data,
				course,stream,semester,
			}

			return data;
			
		}))

	}

	$scope.getBatches=async function(){
		let batches=await facultyService.getBatches($localStorage.college.collegeCode);
		// $scope.$apply(function(){
			$scope.allBatches=batches;
			$scope.analysis.courses=_.chain(batches).pluck('course').uniq().value().sort();
			$scope.analysis.streams=[];
		// })
	}

	$scope.getAnalysisStreams=function(){
		console.log({course:$scope.analysis.selectedCourse});

		var StreamDetails = _.where($scope.allBatches, {course:$scope.analysis.selectedCourse});
		// console.log(StreamDetails);
		let streams =  _.chain(StreamDetails).pluck('stream').uniq().value().sort();
		// $scope.$apply(function(){
			$scope.analysis.streams=streams;
			console.log($scope.analysis.streams);
			// $scope.$apply();

		// })
	}

	// $scope.$watch();

	$scope.analyseFeedback=function(){
		

		$scope.analysisUtility($scope.allBatches)
		.then(data=>{
			$scope.analysisData=data;
			$scope.analysisData.forEach((data,ind)=>{
				try{
					let sem;
					(Object.keys(data.studentData[0]).some(function(key){
						if(/s_/.test(key)) {sem=key;return key;}
					}));
	
					let filled=(_.filter(data.studentData,function(stu){return stu[sem]==1;})).length;
					let total=data.studentData.length;
					let percentageFb=(filled*100/total).toFixed(2);

					$scope.$apply(function(){
						$scope.allBatches[ind]={
							...$scope.allBatches[ind],
							percentageFb,total,filled
						}
					})
				} catch(err){
					$scope.$apply(function(){
						$scope.allBatches[ind]={
							...$scope.allBatches[ind],
							percentageFb:"0.00",
							total:data.studentData.length,
							filled:data.studentData.length
						}
						$scope.showAnalysis=true;
					});
				}
			})
		})
	}

	$scope.getDetails();
	$scope.getFeedback();

	$scope.getBatches();
})
