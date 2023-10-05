const userModel = require("../models/UserModel");
const doctorModel = require("../models/doctorModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).send({
      success: true,
      message: "All users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find();
    res.status(200).send({
      success: true,
      message: "All doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const changesAccountStatus = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
    const user = await userModel.findOne({ _id: doctor.userId });
    const notification = user.notification;
    notification.push({
      type: "doctor-access-account-requested",
      message: `Your doctor account requesr has  ${status} `,
      onClickPath: "/notification",
    });
    user.isDoctor === "approved" ? true : false;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Account status updated",
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
module.exports = { getAllUsers, getAllDoctors, changesAccountStatus };
