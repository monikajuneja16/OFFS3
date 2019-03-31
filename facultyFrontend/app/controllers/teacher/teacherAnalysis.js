faculty.controller("tAnalysisCtrl", function($scope, $rootScope, $location, teacherService,$localStorage) {

	$scope.teacher = [];
	$scope.selectedYear = '2018';
	$scope.year = 'August 2018 - May 2019';
	$scope.searching = false;
	$scope.searched = false;
	//$scope.steacher=$rootScope.teacher.instrctor_id;

	$scope.populate = function() {
		console.log($localStorage);

		teacherService.populate($scope.selectedYear, function(response) {
			$scope.teacherfb = response;
			console.log($scope.teacherfb);

			$scope.subjects = _.chain($scope.teacherfb.data).pluck('subject_name').uniq().value();
			$scope.course 	= _.chain($scope.teacherfb.data).pluck('course').uniq().value();
			
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
			console.log("Courses : "+$scope.course);
			var c=$scope.course;
			//if(c==='BTECH')
			//c='B.Tech';
			//console.log(typeof"$scope.course");
			//console.log(c);
			$scope.stream 	= _.chain($scope.teacherfb.data).pluck('stream').uniq().value();
			$scope.semester = _.chain($scope.teacherfb.data).pluck('semester').uniq().value();
			//$scope.years 	= ['2014', '2015', '2016', '2017','2018'];
			// init all selects
			$(document).ready(function () {
				$('select').material_select();
			})
		})
	}

    

     $scope.logout = function(req,res) {
     	$location.path("/");
	teacherService.logout(function(response) {
			
		})
		$location.path("/");
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
			"The teacher helped you build your capability to think and plan the experiments independently and analyze the results critically.",
			"Encourages and makes you feel comfortable about asking questions.",
			"Provides enthusiastic, clear and satisfactory response to student s questions."
		]

	}

	$scope.updateSubjects = function () {

	}
	$scope.subjectLists = function() {
		var arr = [3];
		arr[0] = {semester: $scope.selectedSem}
		arr[1] = {course: $scope.selectedCourse}
		
		//Only to resolve MTECH and BTECH problem aaawwww!!!
		if(arr[1].course=='B. TECH' && $scope.bmtech[0]=='BTECH'){arr[1].course=$scope.bmtech[0];}
		else if(arr[1].course=='M. TECH' && $scope.bmtech[1]=='MTECH'){arr[1].course=$scope.bmtech[1];}

		arr[2] = {stream:$scope.selectedStream}
        console.log("in subject");
        console.log(arr[0],arr[1],arr[2]);
		var	subjectDetails = _.clone($scope.teacherfb.data);
		console.log(subjectDetails);

		for (var x =0;x<arr.length;x++) {
			var key = Object.keys(arr[x]);
			var val = key[0];
			if (arr[x][key[0]] !=undefined){
				console.log(arr[x][key[0]]);
				subjectDetails = _.where(subjectDetails, { [val]: arr[x][key[0]]  } )
			}
			 
		}
         console.log(subjectDetails);
		$scope.subjects =  _.chain(subjectDetails).pluck('subject_name').uniq().value().sort();

		$(document).ready(function () {
			$('select').material_select();
		})
	}

$scope.semesterList = function() {
	var arr=[2];
	arr[0] = {course: $scope.selectedCourse}
	
	//Only to resolve MTECH and BTECH problem aaawwww!!!
	if(arr[0].course=='B. TECH' && $scope.bmtech[0]=='BTECH'){arr[0].course=$scope.bmtech[0];}
	else if(arr[0].course=='M. TECH' && $scope.bmtech[1]=='MTECH'){arr[0].course=$scope.bmtech[1];}

	arr[1] = {stream:$scope.selectedStream}
	console.log("in semester");
        console.log(arr[0],arr[1]);
		var	semesterDetails = _.clone($scope.teacherfb.data);
		console.log(semesterDetails);

		for (var x =0;x<arr.length;x++) {
			var key = Object.keys(arr[x]);
			var val = key[0];
			if (arr[x][key[0]] !=undefined){
				console.log(arr[x][key[0]]);
				semesterDetails = _.where(semesterDetails, { [val]: arr[x][key[0]]  } )
			  }
			}
			 console.log(semesterDetails);
		$scope.semester =  _.chain(semesterDetails).pluck('semester').uniq().value().sort();

		$(document).ready(function () {
			$('select').material_select();
		})
			 
		}


	$scope.streamList = function() {
		var course = $scope.selectedCourse;
		
		//Only to resolve MTECH and BTECH problem aaawwww!!!
		if(course=='B. TECH' && $scope.bmtech[0]=='BTECH'){course=$scope.bmtech[0];}
		else if(course=='M. TECH' && $scope.bmtech[1]=='MTECH'){course=$scope.bmtech[1];}


		var StreamDetails = _.where($scope.teacherfb.data, {course:course});
		console.log(StreamDetails);
		$scope.stream =  _.chain(StreamDetails).pluck('stream').uniq().value().sort();
		console.log($localStorage.stream);
		$(document).ready(function () {
			$('select').material_select();
		})
	}

	$scope.search = function () {

		$scope.searching = true;

		var course 	= $scope.selectedCourse;

		//Only to resolve MTECH and BTECH problem aaawwww!!!
		if(course=='B. TECH' && $scope.bmtech[0]=='BTECH'){course=$scope.bmtech[0];}
		else if(course=='M. TECH' && $scope.bmtech[1]=='MTECH'){course=$scope.bmtech[1];}

		var sem 	= $scope.selectedSem;
		var stream 	= $scope.selectedStream;
		var subject = $scope.selectedSubject;
		var year  	= $scope.selectedYear;
		var teacher = $scope.teacher.name;

		console.log(sem, course, stream,subject);

		/*if (!subject || !course || !stream || !sem || !year) {
			return;
		}*/
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

		teacherService.getTeacherfb(course, sem, stream, subject, year, function(response) {
			console.log(response);
		 	var final_res = _.where(response, mdict);


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
		}

		else {
			$scope.final_res = final_res;
		}


  /*One Time Preprocessing

		final_res.forEach(function(val) {
			if (!_.isObject(val['at_1']) && _.isString(val['at_1'])) {


			if (val['at_15']) {
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

		$scope.final_res = final_res;*/

	//		console.log(final_res);

		})

	}

	$scope.print = function (){
	alert("PDF is getting downloaded,it may take some Time.");
     var quotes = document.getElementById('mycanvas');


             html2canvas(quotes,{scale: 2}
						 ).then(canvas => {

                 //! MAKE YOUR PDF
                 var pdf = new jsPDF('l', 'pt','a4','true');
                 for (var i = 0; i <= quotes.clientHeight/1300; i++) {
                     //! This is all just html2canvas stuff
                     var srcImg  = canvas;
                     var sX      = 0;
                     var sY      = 1300*i; 
                     var sWidth  = 2500;
                     var sHeight = 1300;
                     var dX      = 0;
                     var dY      = 0;
                     var dWidth  = 2500;
                     var dHeight = 1300;

                     window.onePageCanvas = document.createElement("canvas");
                     onePageCanvas.setAttribute('width', 2500);
                     onePageCanvas.setAttribute('height', 1300);
                     var ctx = onePageCanvas.getContext('2d');

                     // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
                     ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);

                     // document.body.appendChild(canvas);
                     var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

                     var width         = onePageCanvas.width;
                     var height        = onePageCanvas.clientHeight;

                     //! If we're on anything other than the first page,
                     // add another page
                     if (i > 0) {
                         pdf.addPage(843, 612); //8.5" x 11" in pts (in*72)
                        }
                     //! now we declare that we're working on that page
                     pdf.setPage(i+1);
                     //! now we add content to that page!
                     pdf.addImage(canvasDataURL, 'JPEG', 30, 40, (width*.62) - 400, (height*.62)-175,'','FAST');

                    }
                 //! after the for loop is finished running, we save the pdf.
                pdf.save('feedback_report.pdf');        
           });
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

    $scope.yearChange = function () {
		$scope.selectedYear = $scope.year.slice(7,11);
 	    console.log('changed');
 	    $scope.populate();
    }

	$scope.getDetails = function() {
		teacherService.getDetails(function(response) {
			$scope.teacher = response;
			console.log("*************");
			console.log($scope.teacher);
		})
	}

	$scope.getDetails();
	$scope.populate();
	//$localStorage.clear();
});
