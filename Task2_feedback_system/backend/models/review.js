const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  rating: Number,
  review: String,
  aiUserMessage: String,
  aiSummary: String,
  aiRecommendation: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Review", ReviewSchema);