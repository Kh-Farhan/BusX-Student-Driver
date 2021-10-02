import express from "express";
const router = express.Router();
import studentController from  "../Controllers/student.controllers.js";

//main route
router.get("/",studentController.indexFunction);
router.post("/login",studentController.loginFunction);
router.get("/viewRoute",studentController.getRouteFunction);
router.post("/changeRoute",studentController.changeRouteFunction);
router.get("/getData/:id",studentController.getDataFunction);
router.get("/getBus",studentController.getBus);
router.get("/getAttendence/:id",studentController.getAttendence);
router.post("/SetAttendence",studentController.setAttendence);
router.post("/SetNearby",studentController.setNearby);
router.post("/SetStop",studentController.setStop);
router.post("/complain",studentController.complainFunction);
router.post("/feedback",studentController.feedbackFunction);
router.post("/sendEmail",studentController.sendEmail);
router.get("/resetPass/:token",studentController.resetPass);
router.post("/changePass",studentController.changePass);
router.get("/get1Route/:id",studentController.getOneRouteFunction);
export default router;