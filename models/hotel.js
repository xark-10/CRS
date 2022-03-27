//TODO: Add JOI to the user schema and add validation to the firstName and lastName other required fields and perform validate before saving to avoid SQL Injection.
// https://www.npmjs.com/package/joi

// Required dependencies
const mongoose = require("mongoose")
const { Logger } = require("logger")
const bcrypt = require('bcrypt')
require('dotenv').config()
const saltValue = 12

// User Schema definition
var hotelSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
      require: true,
      unique: true,
      minlength: 6,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      require: true,
      unique: true,
      minlength: 6,
    },
    password: {
      type: String,
      require: true,
    },
    hotelName:{
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    star_rating: {
      type: String,
      require: true,
    },
    totalBookings: {
      type: Number,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    town: {
      type: String,
      require: true,
    },
    couple: {
      type: Number,
      require: true,
    },
    single: {
      type: Number,
      require: true,
    },
    superDeluxe: {
      type: Number,
      require: true,
    },
    deluxe: {
      type: Number,
      require: true,
    },
    luxury: {
      type: Number,
      require: true,
    },
    phone: {
      type: Number,
      require: true,
    },
    image: {
      type: String,
    },
  },

  { collection: "Hotels" }
);


hotelSchema.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(saltValue, function (err, salt) {
      if (err) {
        return next(err)
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err)
        }
        user.password = hash;
        next()
      })
    })
  } else {
    return next()
    //logger.error('error', `User Model - Returning User`)
  }
})

module.exports = mongoose.model("Hotel", hotelSchema);