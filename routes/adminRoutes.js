const express = require("express");
const authmiddleware = require("../middlewares/authmiddleware");
const {
  getAllUsers,
  getAllDoctors,
  changesAccountStatus,
} = require("../controllers/adminController");
const router = express.Router();
router.post("/allusers", authmiddleware, getAllUsers);
router.post("/alldoctors", authmiddleware, getAllDoctors);
router.post("/changesAccountStatus", authmiddleware, changesAccountStatus);
module.exports = router;
