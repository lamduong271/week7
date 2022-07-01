const mongoose = require("mongoose");

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    item: [String],
  })
);
module.exports = Post;
