const UserModel = require("../models/UserModel");
const appoinmentModel = require("../models/appoinmentModel");
const doctorModel = require("../models/doctorModel");

const getDoctorInfo = async (req, res) => {
  try {
    const doctor = await doctorModel.find();
    res.status(200).send({
      success: true,
      message: "Doctor Data fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const updateprofile = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).send({
      success: true,
      message: "Doctor Data fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const getdoctorbyid = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Doctor Data fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const doctorappoinments = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appoinments = await appoinmentModel.find({
      doctorId: doctor._id,
    });
    res.status(200).send({
      success: true,
      message: "Doctors Appoinments fetched successfully",
      data: appoinments,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const updateappstatus = async (req, res) => {
  try {
    const { appoinmentsId, status } = req.body;
    const appoinment = await appoinmentModel.findByIdAndUpdate(appoinmentsId, {
      status,
    });
    const user = await UserModel.findOne({ _id: appoinment.userId });
    const notification = user.notification;
    notification.push({
      type: "status update",
      message: `Your  Appoinment has been ${status}`,
      onClickPath: "/doctor/doctorappoinments",
    });
    res.status(200).send({
      success: true,
      message: "Appoinment status updated",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getDoctorInfo,
  updateprofile,
  getdoctorbyid,
  doctorappoinments,
  updateappstatus,
};
