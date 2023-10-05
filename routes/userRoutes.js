const express = require("express");
const {
  login,
  register,
  authController,
  applyDoctor,
  allnotifications,
  deletenotifications,
  getalldoctors,
  bookappoinment,
  bookavailability,
  userappoinments,
  allusersget
} = require("../controllers/userController");
const authmiddleware = require("../middlewares/authmiddleware");
const router = express.Router();
router.post("/login", login);
router.post("/register", register);
router.post("/getuserdata", authmiddleware, authController);
router.post("/applydoctor", authmiddleware, applyDoctor);
router.post("/allnotifications", authmiddleware, allnotifications);
router.post("/deletenotifications", authmiddleware, deletenotifications);
router.post("/getalldoctors", authmiddleware, getalldoctors);
router.post("/bookappoinment", authmiddleware, bookappoinment);
router.post("/bookavailability", authmiddleware, bookavailability);
router.post("/userappoinments", authmiddleware, userappoinments);
router.post("/allusers",allusersget)
module.exports = router;
