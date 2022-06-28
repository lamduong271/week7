const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routes/user");

app.use(
  cors({
    origin: "*",
  })
);
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});
// DB
const monggoUrl = "mongodb://localhost:27017/testdb";
mongoose
  .connect(monggoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.use("/api", userRouter);
// set port, listen for requests
const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
