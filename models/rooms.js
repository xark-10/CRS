//TODO: Add JOI to the user schema and add validation to the firstName and lastName other required fields and perform validate before saving to avoid SQL Injection.
// https://www.npmjs.com/package/joi

// Required dependencies
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const { Logger } = require("logger")
const Hotel = require('./hotel')
require('dotenv').config()

// User Schema definition
var rooms = new Schema(
  {
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
    },
    number: {
      type: String,
      required: [true, 'Room number is required']
    },
    type: {
      type: String,
      required: [true, 'Please specify room type']
    },
    price: {
      type: Number,
      required: [true, 'Please specify price per night']
    },
    maxGuests: {
      type: Number,
      required: [true, 'Please specify maximum number of guests allowed']
    },
    dateCreated: {
      type: Date,
      default: Date.now
    },
    beds: {
      type: Number
    },
    image: {
      type: String,
    },
  },
  { collection: "Rooms" }
);



module.exports = mongoose.model("Rooms", rooms);