var express = require("express");
var router = express.Router();
var User = require("../models/user.model");
var bcrypt = require("bcrypt");
var jsonWebToken = require("jsonwebtoken");
router.get("/user/register", (req, res) => {
  res.send("Welcome to authentication tutorial");
});

var JSON_SECRET_CODE = "thiIsADog";

const saltRounds = 10;

router.post("/user/register", async (req, res) => {
  console.log(req.body);
  try {
    const existUser = await User.findOne({ email: req.body.email });
    console.log("existUser ", existUser);
    if (existUser) {
      res.send("Email already in use.");
    } else {
      const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
      await User.create({
        email: req.body.email,
        password: hashedPwd,
      });
      res.send("ok");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const existUser = await User.findOne({ email: req.body.email });

    if (existUser) {
      const comparedPwd = await bcrypt.compare(
        req.body.password,
        existUser.password
      );
      if (comparedPwd) {
        var token = jsonWebToken.sign(
          {
            id: existUser._id,
            email: existUser.email,
          },
          JSON_SECRET_CODE
        );
        res.send({ success: true, token });
      } else {
        res.status(401).send({ message: "not found" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
  }
});

module.exports = router;
