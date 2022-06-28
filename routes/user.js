var express = require("express");
var router = express.Router();
var User = require("../models/user.model");
var bcrypt = require("bcrypt");
router.get("/user/register", (req, res) => {
  res.send("Welcome to authentication tutorial");
});

router.post("/user/register", async (req, res) => {
  console.log(req.body);
  const saltRounds = 10;
  try {
    const existUser = await User.findOne({ email: req.body.email });
    if (existUser) {
      res.send("Email already in use.");
    }
    const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
    await User.create({
      username: req.body.username,
      password: hashedPwd,
    });
    res.send("ok");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const existUser = await User.findOne({ email: req.body.email });
    if (existUser) {
      const comparedPwd = await bcrypt.compare(req.body.password, saltRounds);
      if (comparedPwd) {
        res.send({ success: true });
      }
      res.status(401).send({ message: "not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
  }
});

module.exports = router;
