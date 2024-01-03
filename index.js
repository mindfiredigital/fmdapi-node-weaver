// app.js

require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routes
const indexRoutes = require("./routes/index");

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// My Routes
app.use("/api", indexRoutes);

// Export the function for running the server
module.exports.run = function (port = process.env.PORT || 8000) {
  app.get("/", (req, res) => {
    res.send("Server is running.");
  });

  app.listen(port, () => {
    console.log(`app is running at ${port}`);
  });
};

// If the file is run directly, start the server with the default port
if (require.main === module) {
  module.exports.run();
}
