const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  username:{
    type:String,
    required: true
  },
  password:{
    type:String,
    required:true
  },
  email: {
    type : String,
    required: true
  },
  name:{
    type:String,
    required:true
  },
  isSocial:{
    type:Boolean,
    default:false
  },
  profilePicture:{
    type: String
  },
  social:{
    socialId:String,
    token: String,
    provider: String
  }
});

module.exports = User = mongoose.model("user", userSchema);
