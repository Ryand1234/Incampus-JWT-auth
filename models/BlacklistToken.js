const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  token:{
    type:String,
    required: true
  }
});

module.exports = BlacklistToken = mongoose.model("blacklisttoken", blacklistSchema);
