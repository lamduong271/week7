var express = require("express");
var router = express.Router();
var User = require("../models/user.model");
var bcrypt = require("bcrypt");
var jsonWebToken = require("jsonwebtoken");
const { JSON_SECRET_CODE } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

router.get("/user/register", (req, res) => {
  res.send("Welcome to authentication tutorial");
});

const saltRounds = 10;

router.post(
  "/user/register",
  body("email").isEmail(),
  // password must be at least 5 chars long
  body("password").isLength({ min: 8 }),
  async (req, res) => {
    console.log(req.body);
    try {
      const existUser = await User.findOne({ email: req.body.email });
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
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
  }
);

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
          JSON_SECRET_CODE,
          {
            expiresIn: 86400,
          }
        );
        existUser.token = token;
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
