var express = require("express");
var router = express.Router();

var routes = {
	views: {
		index: require("./views/index"),
		dean: require("./views/dean"),
		vc: require("./views/vc"),
		pvc: require("./views/pvc"),
		teacher: require("./views/teacher"),
		dataportal: require("./views/dataportal")
	}
}


router.get("/", routes.views.index.index);
router.post("/initials", routes.views.index.initials);
router.post("/verify", routes.views.index.verify);
router.get("/dashboard", routes.views.index.dashboard);
router.post("/edit", routes.views.index.edit);
router.get("/feedbackform", routes.views.index.feedbackform);
router.post("/feedback", routes.views.index.feedback);
router.get("/getStudentStatus", routes.views.index.getStudentStatus);
router.get("/getStudentDetails", routes.views.index.getStudentDetails);
router.post("/sendStudent", routes.views.index.studentData);
router.get("/updateStudent", routes.views.index.updateStudent);
// router.get("/update",routes.views.index.update_s_series);
//DEAN MODULE==============================================================
/*
 	All the dean routes are made in /views/dean.js
 	and the url start with prefix d as /initials is converted to /dinitials
	Erase this after you understand !
*/


router.post("/dinitials", routes.views.dean.initials); //To authenticate the dean
router.get("/dchecksession", routes.views.dean.checksession); //This is a temporary route.
router.get("/ddashboard", routes.views.dean.dashboard); // To get details of a BACH .

router.post("/vinitials", routes.views.vc.initials); //To authenticate the dean
router.get("/vchecksession", routes.views.vc.checksession); //This is a temporary route.
router.get("/vdashboard", routes.views.vc.dashboard); // To get details of a BACH .

router.post("/pvinitials", routes.views.pvc.initials); //To authenticate the dean
router.get("/pvchecksession", routes.views.pvc.checksession); //This is a temporary route.
router.get("/pvdashboard", routes.views.pvc.dashboard); // To get details of a BACH .

router.post("/tinitials", routes.views.teacher.initials); //To authenticate the teacher
router.get("/tchecksession", routes.views.teacher.checksession); //This is a temporary route: profile details
router.get("/tpopulate", routes.views.teacher.populate); // To populate the dropdowns
router.get("/tdashboard", routes.views.teacher.dashboard); // To view the feedback of a BACH .

router.get("/getTeacher", routes.views.dataportal.getTeacher);
router.get('/getCourse', routes.views.dataportal.getCourse);
router.get('/getStream', routes.views.dataportal.getStream);
router.get('/getSubjects', routes.views.dataportal.getSubjects);
router.post("/createFeedback", routes.views.dataportal.createFeedback);

module.exports = router;