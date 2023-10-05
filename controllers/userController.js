const UserModel = require("../models/UserModel.js");
const appoinmentModel = require("../models/appoinmentModel.js");
const doctorModel = require("../models/doctorModel.js");
const Alldata = require("../models/doctorModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://admin:suriya25@cluster0.pbesyta.mongodb.net/suriya?retryWrites=true&w=majority'; // Replace with your database URI
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Call the connect function to establish the connection
connectToMongoDB();
const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "user not found",
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({
        success: false,
        message: "password does not match",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({
      token,
      success: true,
      message: "Login Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const register = async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "user already exists",
      });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = await UserModel(req.body);
    await newUser.save();
    res.status(201).send({
      success: true,
      message: "User Successfully savedd",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userid });
    user.password = undefined;
    if (!user) {
      res.status(500).send({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const applyDoctor = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await UserModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-notification",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has applied for A Doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await UserModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor applied successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const allnotifications = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userId });
    const seennotificatioin = user.seennotificatioin;
    const notification = user.notification;
    seennotificatioin.push({ ...notification });
    user.notification = {};
    user.seennotificatioin = notification;
    const updatedUser = await user.save();
    res.status(201).send({
      success: true,
      message: "all notifications are marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const deletenotifications = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotificatioin = [];
    const updatedUser = user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "notifications deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const getalldoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "doctors fetched successfully",
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
const bookappoinment = async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    const newAppoinment = new appoinmentModel(req.body);
    await newAppoinment.save();
    const user = await UserModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New Appoinment Notifications",
      message: `A new Appoinment was requested ${req.body.userInfo.name}`,
      onClickPath: "/user/appoinments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appoinment Booked successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const bookavailability = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appoinments = await appoinmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appoinments.length > 0) {
      return res.status(200).send({
        message: "Appoinment is not available this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appoinment availble",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const userappoinments = async (req, res) => {
  try {
    const appoinments = await appoinmentModel.find();
    res.status(200).send({
      success: true,
      message: "Appoinment Fetched successfully",
      data: appoinments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const allusersget=async(req,res)=>{
  try {
    const collection = client.db().collection('alldata');
    const data = await collection.find({ ISIN: { $exists: true, $ne: "" } }).toArray();
    res.status(200).json({
      message: "Hello",
      data: data
    });
  } catch (error) {
    // Handle the error appropriately
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
}
module.exports = {
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
};
