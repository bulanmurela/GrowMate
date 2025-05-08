require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const auth = require("./routes/auth");
// const UserRoutes = require("./routes/UserRoutes");
// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", auth);
// app.use("/api/users", UserRoutes);

module.exports = app;
