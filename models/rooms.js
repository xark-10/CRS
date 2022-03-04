//TODO: Add JOI to the user schema and add validation to the firstName and lastName other required fields and perform validate before saving to avoid SQL Injection.
// https://www.npmjs.com/package/joi

// Required dependencies
const mongoose = require("mongoose")
const { Logger } = require("logger")
require('dotenv').config()

  // User Schema definition
  var rooms = new mongoose.Schema(
    {
      HotelName:{
        type: String,
        lowercase: true,
        trim: true,
        require: true,
        unique: true,
        minlength: 6,
      },
      Hotel_id: {
        type: String,
        lowercase: true,
        trim: true,
        require: true,
        unique: true,
      },
      category: {
        type: String,
        require: true,
      },
      beds: {
        type: Number
      },
      price: {
        type: String
      },
      isBooked:{
        type: Boolean
      }
    },
    { collection: "Rooms" }
  );



module.exports = mongoose.model("Rooms", rooms);