const mongoose = require("mongoose");

const ArticleSchema = mongoose.Schema({
  articleName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  articleBody: {
    type: String,
    required: true,
  },
  publishDate: {
    type: Date,
    default: Date.now(),
  },
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Article", ArticleSchema);
