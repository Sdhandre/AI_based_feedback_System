const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const reviewRoutes = require("./routes/reviews");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/reviews", reviewRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
