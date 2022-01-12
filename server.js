require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes=require('./api/routes/user.route');

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

mongoose
  .connect(process.env.MONGO_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to mongo.");
  })
  .catch((err) => {
    console.log("Error connecting to mongo.", err);
  });

app.use(express.urlencoded());
app.use(express.json());
app.use('/api',userRoutes)

const port =  4000;
app.listen(port, () => {
  console.log("Listening on port: " + port);
});