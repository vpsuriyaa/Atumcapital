const express = require("express");
const authmiddleware = require("../middlewares/authmiddleware");
const {
  getDoctorInfo,
  updateprofile,
  getdoctorbyid,
  doctorappoinments,
  updateappstatus,
} = require("../controllers/doctorController");
const router = express.Router();
router.post("/doctorinfo", authmiddleware, getDoctorInfo);
router.post("/updateprofile", authmiddleware, updateprofile);
router.post("/getdoctorbyid", authmiddleware, getdoctorbyid);
router.post("/doctorappoinments", authmiddleware, doctorappoinments);
router.post("/updateappstatus", authmiddleware, updateappstatus);
router.post("/datafetch",(req,res)=>{
  try {
    
  } catch (error) {
    
  }
})
module.exports = router;
