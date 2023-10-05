const mongoose = require("mongoose");

const ConnectedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true});
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = ConnectedDB;
