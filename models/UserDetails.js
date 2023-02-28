const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserDetailsSchema = new mongoose.Schema({
  id:{
    type: String,
  },
  name: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email:{
    type:String,
    unique:true,
    },
    Mobile:{
    type:String,
  },
  DateofBirth: {
      type: Date,
    },
    Gender: {
      type: String,
    },
    loginTime:{
      type:String
    },
    image: {
      type: String,
    },
    aboutme:{
      type: String
    },
    lastlogin:{
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  })

  module.exports = mongoose.model('UserDetails', UserDetailsSchema);