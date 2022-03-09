const logger = require('../config/logger.js')
const jwt = require('jsonwebtoken')
const authStringConstant = require('../constants/strings')
const User = require('../models/user')
const Rooms = require('../models/rooms')
const Booking = require('../models/booking')
const httpStatusCode = require('../constants/httpStatusCodes');
const bcrypt = require('bcrypt')
const passwordSchema = require('../validator/passwordValidator')
const emailValidator = require('../validator/emailValidator');
const redisClient = require('../database/redisConnection')
const { decode } = require('punycode');
const booking = require('../models/booking.js')


const bookingActions = {
     newBooking : async function(req,res){
        try{
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
              const { hotel_id, room_id, check_in, check_out, guests,hotelName,user_id } = req.body;

              if (!hotel_id && !room_id && !check_in && !check_out && !guests && !category) {
                res.status(httpStatusCode.BAD_REQUEST).send({
                  success: false,
                  message: authStringConstant.MISSING_INPUT
                });
              }
              //Get the username from the decoded json web token
              const username = decodedAccessToken.username


              const user = await User.findOne({ username });
              const room = await Rooms.findOne({_id:room_id});

              const roomPrice = room.price; 

              if (!user) {
                res.status(httpStatusCode.UNAUTHORIZED).send({
                  success: false,
                  message: authStringConstant.USER_DOES_NOT_EXIST
                });
              }else if(!room){
                res.status(httpStatusCode. NO_CONTENT).send({
                    success: false,
                    message: authStringConstant.ROOM_NOTFOUND
                })
              }
              // Validate if user exist in our database
              else if (user , room) {
                const newBooking = Booking({
                    room_id :room_id,
                    hotel_id :hotel_id,
                    price : roomPrice,
                    user_id : user_id,
                    check_in :check_in,
                    check_out :check_out,
                    hotelName : hotelName,
                    guests: guests
                });
                newBooking.save(function (err, newBooking){
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
            else {
                res.status(httpStatusCode.GATEWAY_TIMEOUT).send({
                    success: false,
                    message: authStringConstant.UNKNOWN_ERROR,
                });
            }
        }catch(err){
            console.log(err.message)
        }
    } 
}
module.exports = bookingActions;
