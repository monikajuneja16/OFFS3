faculty.controller('studentDataCtrl', ['$http', '$scope', 'dataPortalService', 'studentDataService', '$location', '$window',function ($http, $scope, dataPortalService, studentDataService, $location, $window) {

	$scope.disabled = false;
	$scope.data = [];
	$scope.selectedYear = '2018';
	$scope.year = 'August 2018 - May 2019';
	$scope.file = "";
	$scope.showSpinner=false;

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

	$scope.isHome = true;
	$scope.isEdit = false;
	$scope.isAdd = false;

	//$scope.table = retrieve();
	$scope.table = buildTable();
	$scope.date = new Date();

	$scope.courseList = [];
	$scope.stream = [];
	$scope.searched = false;

	// $(function () {
	// 	var i = 0;
	// 	$('table thead tr').prepend('<th>#</th>');
	// 	$('table tbody tr').each(function () {
	// 		i += 1;
	// 		$(this).prepend('<td>' + i + '</td>');
	// 	});
	// });

	$scope.collegeSelected = function() {
		if (!$scope.selectedCollege) {
			return;
		}

		var college = $scope.selectedCollege;
		var collegeCode = "";

		var CollegeCodes = _.where($scope.collegeList, {
			collegeName: college
		});
		_.forEach($scope.collegeList, function (value, key) {

			if ((value.collegeName) == (college)) {
				$scope.collegeCode = value.collegeCode;
			}

		})

		if ($scope.collegeCode) {
			dataPortalService.getCourse($scope.collegeCode, function (responce) {
				if (responce) {
					$scope.courseList = responce;

					$(document).ready(function () {
						$('select').material_select();
					})

				}
			})

		}
	}

	$scope.courseSelected = function () {
		if (!$scope.selectedCourse || !$scope.selectedCollege) {
			return;
		}

		if ($scope.collegeCode && $scope.selectedCourse) {
			dataPortalService.getStream($scope.collegeCode, $scope.selectedCourse, function (responce) {
				if (responce) {
					$scope.streamList = responce;
					$(document).ready(function () {
						$('select').material_select();
					})
				}
			})
		}
	}

	$scope.streamSelected = function () {
		if (!$scope.selectedCollege || !$scope.selectedCourse || !$scope.selectedStream) {
			return;
		}
		$scope.searched = true;
	}

	$scope.submit = function () {
		$scope.showSpinner=!$scope.showSpinner;
		if ($scope.data.length == 0) {
			alert("student list is empty");
			$scope.showSpinner=!$scope.showSpinner;
			return;
		}

		if (!checkData()) {
			alert('some fields are missing');
			$scope.showSpinner=!$scope.showSpinner;
			return;
		}


		studentDataService.sendData($scope.collegeCode, $scope.selectedCourse, $scope.selectedStream, $scope.selectedYear, $scope.data, function (res) {
			if (res.data) {
				console.log(res.data);
				if (res.data.status == 200) {
					$window.alert("Student data recorded");
					$scope.showSpinner=!$scope.showSpinner;
					
				} else {
					$window.alert("Student Entry exists");
					$scope.showSpinner=!$scope.showSpinner;
					$location.path("/studentData");
				}
			}
		})
	}

	// $scope.removeRow = function ($index) {
	// 	if ($index > -1 && $scope.table.rows.length > 1) {
	// 		$scope.table.rows.splice($index, 1);
	// 	}
	// };

	$scope.editRows = function () {
		$scope.isHome = false;
		$scope.isEdit = true;
		$scope.isAdd = false;
	};

	$scope.done = function () {
		$scope.isHome = true;
		$scope.isEdit = false;
		$scope.isAdd = false;
	};


	$scope.addRollNumber = function(studentData, enrollment_no) {
		if (!enrollment_no) {
			return;
		}

		studentData.enrollment_no = enrollment_no;
	}

	$scope.addName = function(studentData, name) {
		if (!name) {
			return;
		}

		console.log($scope.data);
		studentData.name = name;
	}

	$scope.addEmail = function(studentData, email) {
		if (!email) {
			return;
		}


		studentData.email = email;
	}

	$scope.removeRow = function(studentData) {
		console.log(studentData);
		$scope.data = _.without($scope.data, _.findWhere($scope.data, {

		  enrollment_no: studentData.enrollment_no
		}));
	}

	$scope.addphone = function(studentData, phone) {
		if (!phone) {
			return;
		}

		studentData.phone = phone;
	}

	$scope.length = 0;
	$scope.data   = [];

	function addData() {
		console.log($scope.uploadedData);
		for (var x = 0; x < $scope.uploadedData.length;x++) {
			var obj = {};
			obj.phone = $scope.uploadedData[x].Phone;
			obj.email = $scope.uploadedData[x].Email;
			obj.enrollment_no = $scope.uploadedData[x].Enrollment_number;
			obj.name = $scope.uploadedData[x].Name;
			$scope.data.push(obj);
		}
		console.log($scope.data);
		// $scope.addRow();
	 }
	 
	 $scope.yearChange = function () {
		$scope.selectedYear = $scope.year.slice(7,11);
	}

	$scope.addRow = function (enrollment_no, name, email, phone, password) {

		window.scrollBy(0, 1000);
		// $scope.isHome = false;
		// $scope.isEdit = false;
		// $scope.isAdd = true;
		var insertedData = {};
		insertedData.enrollment_no = enrollment_no;
		insertedData.name = name;
		insertedData.email =  email;
		insertedData.phone = phone;
		insertedData.password = password;
		insertedData.index = $scope.length;

		$scope.data.push(insertedData);
		console.log($scope.data);
		$scope.length++;


		var row = {
				cells: []
			},
		colLen = $scope.table.columns.length;

		for (var i = 0; i < colLen; i++) {
			row.cells.push({
				value: ''
			});
		}
		$scope.table.rows.push(row);
	};

	function retrieve () {

		$scope.disabled = true;

		dataPortalService.getData($scope.collegeCode, $scope.selectedYear, function (res) {
			if (res.data) {
				if (res.data.status == 200) {
					//assign it to the table object
					$location.path("/");
				} else {
					alert(res.data.message);
					$location.path("/studentData");
				}
			}

		})

		return {
			columns: [{
					value: 'Enrollment No.'
				},
				{
					value: 'Name'
				},
				{
					value: 'Email'
				},
				{
					value: 'Phone'
				}],
			rows: [{
				cells: [{
					value: ''
				}, {
					value: ''
				}, {
					value: ''
				}, {
					value: ''
				}]
			}]
		};
	}

	function buildTable () {
		return {
			columns: [{
				value: 'S. No.'
				},
				{
				value: 'Enrollment No.'
				},
				{
					value: 'Name'
				},
				{
					value: 'Email'
				},
				{
					value: 'Phone'
				}],
			rows: [{
				cells: [{
					value: ''
				},{
					value: ''
				}, {
					value: ''
				}, {
					value: ''
				}, {
					value: ''
				}]
			}]
		};
	}

	var oFileIn;

	$(function() {
	    oFileIn = document.getElementById('my_file_input');
	    if(oFileIn.addEventListener) {
	        oFileIn.addEventListener('change', filePicked, false);
	    }
	});


	function filePicked(oEvent) {
	    var oFile = oEvent.target.files[0];

	    var sFilename = oFile.name;
	    // Create A File Reader HTML5
	    var reader = new FileReader();

	    // Ready The Event For When A File Gets Selected
	    reader.onload = function(e) {
	        var data = e.target.result;
	        var cfb = XLS.CFB.read(data, {type: 'binary'});
	        var wb = XLS.parse_xlscfb(cfb);
	        // Loop Over Each Sheet
	        wb.SheetNames.forEach(function(sheetName) {
	            // Obtain The Current Row As CSV
	            var sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);
	            $scope.uploadedData = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
	            addData();
	        });
	    };

	        // Tell JS To Start Reading The File.. You could delay this if desired
	    reader.readAsBinaryString(oFile);
	}


	function checkData() {

		if (!$scope.collegeCode || !$scope.selectedCourse || !$scope.selectedStream || !$scope.selectedYear) {
			alert("please select dropdowns correctly");
			return false;
		}
		console.log($scope.data);
		// $scope.collegeCode, $scope.selectedCourse, $scope.selectedStream, $scope.selectedYear,
		for (var x = 0;x<$scope.data.length;x++) {
			if (!$scope.data[x].enrollment_no || !$scope.data[x].name || !$scope.data[x].email || !$scope.data[x].phone) {
				return false;
			}
		}
		return true;
	}

}])
