//TODO: Add JOI to the user schema and add validation to the firstName and lastName other required fields and perform validate before saving to avoid SQL Injection.
// https://www.npmjs.com/package/joi

// Required dependencies
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const { Logger } = require("logger")
require('dotenv').config()

  // User Schema definition
  var booking = new mongoose.Schema(
    {
      hotel: {
        type: Schema.Types.ObjectId,
        ref: "Hotel",
      },
      hotelName:{
        type: String
      },
      room: {
        type: Schema.Types.ObjectId,
        ref: "Rooms",
      },
      price: {
        type: String
      },
      guests:{
          type:Number
      },
      user:{
        type: Schema.Types.ObjectId,
        ref: "Users",      },
      check_in:{
        type: Date
      },
      check_out:{
        type: Date
      },
      bookingName:{
        type: String
      },
    },
    { collection: "Bookings" }
  );



module.exports = mongoose.model("Bookings", booking);