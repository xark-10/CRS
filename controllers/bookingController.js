const logger = require('../config/logger.js')
const jwt = require('jsonwebtoken')
const authStringConstant = require('../constants/strings')
const User = require('../models/user')
const Rooms = require('../models/rooms')
const Hotel = require('../models/hotel')
const Booking = require('../models/booking')
const httpStatusCode = require('../constants/httpStatusCodes');
const moment = require('moment')


const bookingActions = {
  newBooking: async function (req, res) {
    try {
      if (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "production"
      ) {
        var accessToken = req.body.accessToken;
      } else {
        var accessToken = req.query.accessToken;
      }
      //decode the payload
      const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
      const { hotel_id, check_in, check_out, guests, category } = req.body;
      const checkInDateFormat = moment(new Date(check_in)).format('YYYY-MM-DD');
      const checkOutDateFormat = moment(new Date(check_out)).format('YYYY-MM-DD')
      const checkInDate = new Date(checkInDateFormat)
      const checkOutDate = new Date(checkOutDateFormat)

      if (!hotel_id  && !check_in && !check_out && !guests && !category) {
        res.status(httpStatusCode.BAD_REQUEST).send({
          success: false,
          message: authStringConstant.MISSING_INPUT
        });
      }
      //Get the username from the decoded json web token
      const username = decodedAccessToken.username


      const user = await User.findOne({ username });
      const room = await Rooms.findOne({ hotel: hotel_id, type: category})
      const hotel = await Hotel.findOne({ _id: hotel_id })

      const roomPrice = room.price;
      let categoryCount = 0
      if(category === 'couple'){
        categoryCount = hotel.couple
      }else if( category === 'single'){
        categoryCount = hotel.single

      }else if( category === 'superDeluxe'){
         categoryCount = hotel.superDeluxe

      }else if( category === 'deluxe'){
        categoryCount = hotel.deluxe

      }else if( category === 'luxury'){
        categoryCount = hotel.luxury

      }else {
        categoryCount = null
      }
      if (!user) {
        res.status(httpStatusCode.UNAUTHORIZED).send({
          success: false,
          message: authStringConstant.USER_DOES_NOT_EXIST
        });
      } else if (!room) {
        res.status(httpStatusCode.NO_CONTENT).send({
          success: false,
          message: authStringConstant.ROOM_NOTFOUND
        })
      }
      // Validate if user exist in our database
      else if (user, room) {
        Booking.find({ hotel: hotel._id, "check_out": { $gte: checkInDate } }, function (err, foundBookings) {
           if(foundBookings.length === 0 || foundBookings.length < categoryCount ) {
            const newBooking = Booking({
              hotel: hotel_id,
              room: room._id,
              price: roomPrice,
              user: user._id,
              check_in: checkInDate,
              check_out: checkOutDate,
              guests: guests,
              hotelName: hotel.hotelName,
              bookingName: user.firstName
            });
            newBooking.save(function (err, newBooking) {
              if (err) {
                return res.status(httpStatusCode.CONFLICT).send({
                  success: false,
                  message: authStringConstant.FAILURE_BOOKING,
                  error: err.message,
                });
              } else {
                return res.status(httpStatusCode.OK).send({
                  success: true,
                  message: authStringConstant.BOOKING_SUCCESSFUL,
                  Booking_id: newBooking._id,
                });
              }
            })
          }
          else if(foundBookings.length >= hotel.deluxe ){
            res.status(httpStatusCode.GATEWAY_TIMEOUT).send({
              success: false,
              message: authStringConstant.ROOM_BOOKED,
            });
          }
          else if(err){
            res.status(httpStatusCode.GATEWAY_TIMEOUT).send({
              success: false,
              message: authStringConstant.UNKNOWN_ERROR,
              error: err.message
            });
          }
        });
      }
      else {
        res.status(httpStatusCode.GATEWAY_TIMEOUT).send({
          success: false,
          message: authStringConstant.UNKNOWN_ERROR,
        });
      }
    } catch (err) {
      console.log(err.message)
    }
  }
}
module.exports = bookingActions;
