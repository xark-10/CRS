//TODO: Add JOI to the user schema and add validation to the firstName and lastName other required fields and perform validate before saving to avoid SQL Injection.
// https://www.npmjs.com/package/joi

// Required dependencies
const mongoose = require("mongoose")
const { Logger } = require("logger")
require('dotenv').config()

  // User Schema definition
  var booking = new mongoose.Schema(
    {
      hotel_id: {
        type: String,
        lowercase: true,
        trim: true,
        require: true,
        unique: true,
      },
      room_id:{
        type: String,
      },
      price: {
        type: String
      },
      guests:{
          type:Number
      },
      user_id:{
        type: String
      },
      check_in:{
        type: String
      },
      check_out:{
        type: String
      },
    },
    { collection: "Bookings" }
  );



module.exports = mongoose.model("Bookings", booking);