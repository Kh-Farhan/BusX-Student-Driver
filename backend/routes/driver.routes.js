import express from "express";
const router = express.Router();
import driverController from  "../Controllers/driver.controllers.js";

//main route
router.get("/",driverController.indexFunction);
router.post("/login",driverController.loginFunction);
router.get("/getRoute/:id",driverController.getRouteFunction);
router.post("/addGuest",driverController.addGuestFunction);
router.get("/getStudentDet/:bus",driverController.getDetailFunction);
router.post("/changePass",driverController.changePass);
router.post("/reportEmergency",driverController.reportEmergency);
router.post("/addFuel",driverController.addFuel);
router.post("/scanRfid",driverController.scanRfid);
router.get("/getFuelHistory/:bus",driverController.getFuelHistory);
export default router;