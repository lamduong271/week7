var express = require("express");
var router = express.Router();
const { verifyToken } = require("../middleware/auth");
const Post = require("../models/post.model");

router.post("/todo", verifyToken, async (req, res) => {
  const post = await Post.create(req.body.item);
  res.send({ items: post });
});
module.exports = router;
