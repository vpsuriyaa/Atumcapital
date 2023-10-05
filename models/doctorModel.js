const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema(
  {
    ISIN: {
      type: String,
    }

  },
  {
    timestamps: true,
  }
);
const Alldata = mongoose.model("Alldata", doctorSchema);
module.exports = Alldata;
