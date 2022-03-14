const logger = require('../config/logger.js')
const jwt = require('jsonwebtoken')
const authStringConstant = require('../constants/strings')
const User = require('../models/user')
const Rooms = require('../models/rooms')
const Hotel = require('../models/hotel')
const Booking = require('../models/booking')
const httpStatusCode = require('../constants/httpStatusCodes');


const findActions = {
    findHotels : async function (req,res){
        try{
            const { city, category , town } = req.body;
            if(!city){
                res.status(httpStatusCode.BAD_REQUEST).send({
                    success: false,
                    message: authStringConstant.MISSING_INPUT
                  });
            }else{
               Hotel.find({city: city}, function(err,foundHotels){
                if(err){
                    res.status(httpStatusCode.BAD_REQUEST).send({
                        success: false,
                        message: err
                      });
                }
                else{
                    res.status(httpStatusCode.OK).send({
                        foundHotels: foundHotels
                      });
                }
               });
            }
        }catch(err){
            console.log(err)
        }
    }
}

module.exports = findActions;
