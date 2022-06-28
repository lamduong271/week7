var express = require("express");
var router = express.Router();
var User = require("../models/user.model");

router.get("/user/register", (req, res) => {
  res.send("Welcome to authentication tutorial");
});

router.post("/user/register", async (req, res) => {
  console.log(req.body);
  try {
    const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
    const insertResult = await User.create({
      username: req.body.username,
      password: hashedPwd,
    });
    res.send(insertResult);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
  }
});

module.exports = router;
