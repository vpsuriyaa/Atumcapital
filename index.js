const express = require("express");
const dotenv = require("dotenv");
const ConnectedDB = require("./config/database.js");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const doctorRoutes = require("./routes/doctorRoutes.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
dotenv.config();
ConnectedDB();
const app = express();
const port = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use(express.static(path.join(__dirname, "./frontend")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./frontend/index.html"));
});

app.use(express.static("frontend"));

app.listen(port, () => {
  console.log(`Server listening on the http://localhost:${port}`);
});


