const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userName:{
    type:String,
    required:true,
    unique:true
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/, //adding some validations to email
    unique: true, //email must be unique
  },
  password: {
    type: String,
    required: true,
  },
  address:{
      type:String,
      required:true
  },
  phoneNumber:{
      type:Number,
      required:true
  }
});

module.exports = mongoose.model("User", UserSchema);
