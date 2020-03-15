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
  },
  phone:{
    type:String
  },
  otp:{
    type:Number
  },
  resetPasswordToken: {
    type: String,
    required: false
  },

  resetPasswordExpires: {
      type: Date,
      required: false
  }
}, {timestamps: true});

userSchema.methods.generatePasswordReset = function() {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

module.exports = User = mongoose.model("user", userSchema);
