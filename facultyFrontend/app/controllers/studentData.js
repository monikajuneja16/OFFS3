faculty.controller('studentDataCtrl', function ($http, $scope, dataPortalService, studentDataService, $location) {

	$scope.disabled = false;

	$scope.collegeList = [{
			collegeName: "University School of Law and Legal Studies",
			collegeCode: "uslls"
		},

		{
			collegeName: "University School of Management Studies",
			collegeCode: "usms"
		},

		{
			collegeName: "University School of Education",
			collegeCode: "use"
		},

		{
			collegeName: "University School of BioTechnology",
			collegeCode: "usbt"
		},

		{
			collegeName: "University School of Chemical Technology",
			collegeCode: "usct"
		},

		{
			collegeName: "University School of Environment Management",
			collegeCode: "usem"
		},

		{
			collegeName: "University School of Mass Communication",
			collegeCode: "usmc"
		},

		{
			collegeName: "University School of Basic and Applied Sciences",
			collegeCode: "usbas"
		},

		{
			collegeName: "University School of Architecture and Planning",
			collegeCode: "usap"
		},

		{
			collegeName: "University School of Humanities and Social",
			collegeCode: "ushss"
		},

		{
			collegeName: "University School of Info.,Comm. and Technology",
			collegeCode: "usict"
		}
	];

	$scope.isHome = true;
	$scope.isEdit = false;
	$scope.isAdd = false;

	//$scope.table = retrieve();
	$scope.table = buildTable();
	$scope.date = new Date();

	$scope.courseList = [];
	$scope.stream = [];

	$scope.collegeSelected = function () {
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
	}

	$scope.submit = function () {

		$scope.disabled = true;

		studentDataService.sendData($scope.collegeCode, $scope.selectedCourse, $scope.selectedStream, $scope.selectedYear, $scope.table.rows, function (res) {
			if (res.data) {
				if (res.data.status == 200) {
					alert(res.data.message);
					$location.path("/");
				} else {
					alert(res.data.message);
					$location.path("/studentData");
				}
			}

		})
	}

	$scope.removeRow = function ($index) {
		if ($index > -1 && $scope.table.rows.length > 1) {
			$scope.table.rows.splice($index, 1);
		}
	};

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

	$scope.addRow = function () {
		$scope.isHome = false;
		$scope.isEdit = false;
		$scope.isAdd = true;
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
				},
				{
					value: 'Password'
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
				}, {
					value: ''
				}]
			}]
		};
	}

	function buildTable () {
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
				},
				{
					value: 'Password'
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
				}, {
					value: ''
				}]
			}]
		};
	}

})