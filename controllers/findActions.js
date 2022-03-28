const logger = require('../config/logger.js')
const jwt = require('jsonwebtoken')
const authStringConstant = require('../constants/strings')
const User = require('../models/user')
const Rooms = require('../models/rooms')
const Hotel = require('../models/hotel')
const Bookings = require('../models/booking')
const httpStatusCode = require('../constants/httpStatusCodes');
const moment = require('moment')


const findActions = {
    findHotels: async function (req, res) {
        try {
            const { city, town, hotelName } = req.query;
            if (!city) {
                res.status(httpStatusCode.BAD_REQUEST).send({
                    success: false,
                    message: authStringConstant.MISSING_INPUT
                });
            } else if (city && !town && !hotelName) {
                Hotel.find({ city: city }, function (err, foundHotels) {
                    if (err) {
                        res.status(httpStatusCode.BAD_REQUEST).send({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        if (foundHotels.length === 0) {
                            res.status(httpStatusCode.BAD_REQUEST).send({
                                success: false,
                                message: authStringConstant.HOTEL_NOTFOUND
                            });
                        } else {
                            res.status(httpStatusCode.OK).send({
                                foundHotels: foundHotels
                            });
                        }
                    }
                });
            } else if (city && town && !hotelName) {
                Hotel.find({ city: city, town: town }, function (err, foundHotels) {
                    if (err) {
                        res.status(httpStatusCode.BAD_REQUEST).send({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        if (foundHotels.length === 0) {
                            res.status(httpStatusCode.BAD_REQUEST).send({
                                success: false,
                                message: authStringConstant.HOTEL_NOTFOUND
                            });
                        } else {
                            res.status(httpStatusCode.OK).send({
                                foundHotels: foundHotels
                            });
                        }
                    }
                });
            } else if (city && hotelName && !town) {
                Hotel.find({ city: city, hotelName: hotelName }, function (err, foundHotels) {
                    if (err) {
                        res.status(httpStatusCode.BAD_REQUEST).send({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        if (foundHotels.length === 0) {
                            res.status(httpStatusCode.BAD_REQUEST).send({
                                success: false,
                                message: authStringConstant.HOTEL_NOTFOUND
                            });
                        } else {
                            res.status(httpStatusCode.OK).send({
                                foundHotels: foundHotels
                            });
                        }
                    }
                });
            } else if (city && hotelName && town) {
                Hotel.find({ city: city, hotelName: hotelName, town: town }, function (err, foundHotels) {
                    if (err) {
                        res.status(httpStatusCode.BAD_REQUEST).send({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        if (foundHotels.length === 0) {
                            res.status(httpStatusCode.BAD_REQUEST).send({
                                success: false,
                                message: authStringConstant.HOTEL_NOTFOUND
                            });
                        } else {
                            res.status(httpStatusCode.OK).send({
                                foundHotels: foundHotels
                            });
                        }
                    }
                });
            }
            else {
                res.status(httpStatusCode.BAD_REQUEST).send({
                    success: false,
                    message: authStringConstant.UNKNOWN_ERROR
                });
            }
        } catch (err) {
            console.log(err)
            res.status(httpStatusCode.BAD_REQUEST).send({
                success: false,
                message: err
            });
        }
    },
    findUser: async function (req, res) {
        try {
            if (
                process.env.NODE_ENV === "development" ||
                process.env.NODE_ENV === "production"
            ) {
                var accessToken = req.body.accessToken;
            } else {
                var accessToken = req.query.accessToken;
            }
            if (!accessToken) {
                //Token not found!
                return res.status(403).send(StringConstant.TOKEN_MISSING);
            }
            //decode the payload
            try {

                const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
                if (decodedAccessToken) {
                    //Find the user name from the token 
                    const username = decodedAccessToken.username
                    const user = User.findOne({ username }, function (err, user) {
                        if (err) {
                            res.status(httpStatusCode.UNAUTHORIZED).send({
                                success: false,
                                message: authStringConstant.USER_DOES_NOT_EXIST
                            });
                        }
                        else {
                            res.status(httpStatusCode.OK).send({
                                user: user
                            });
                        }
                    })
                } else {
                    return res.status(401).send(StringConstant.INVALID_TOKEN);
                }
            } catch (err) {
                return res.status(401).send(StringConstant.INVALID_TOKEN);
            }
        } catch (err) {
            return res.status(401).send({
                err: err.message
            });
        }
    },
    bookingHistory: async function (req, res) {
        try {
            if (
                process.env.NODE_ENV === "development" ||
                process.env.NODE_ENV === "production"
            ) {
                var accessToken = req.body.accessToken;
            } else {
                var accessToken = req.query.accessToken;
            }
            if (!accessToken) {
                //Token not found!
                return res.status(403).send(StringConstant.TOKEN_MISSING);
            }
            //decode the payload
            try {

                const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
                if (decodedAccessToken) {
                    //Find the user name from the token 
                    const username = decodedAccessToken.username
                    const user = User.findOne({ username }, function (err, user) {
                        if (!user) {
                            res.status(httpStatusCode.UNAUTHORIZED).send({
                                success: false,
                                message: authStringConstant.USER_DOES_NOT_EXIST
                            });
                        } else if (err) {
                            res.status(httpStatusCode.UNAUTHORIZED).send({
                                success: false,
                                error: err
                            });
                        }
                        else {
                            Bookings.find({ user: user._id }, function (err, foundBookings) {
                                if (err) {
                                    res.status(httpStatusCode.UNAUTHORIZED).send({
                                        success: false,
                                        message: authStringConstant.USER_DOES_NOT_EXIST
                                    });
                                }
                                else {
                                    res.status(httpStatusCode.OK).send({
                                        foundBookings: foundBookings
                                    });
                                }
                            })
                        }
                    })
                } else {
                    return res.status(401).send(StringConstant.INVALID_TOKEN);
                }
            } catch (err) {
                return res.status(401).send(StringConstant.INVALID_TOKEN);
            }
        } catch (err) {
            return res.status(401).send({
                err: err.message
            });
        }
    },
    findBookings: async function (req, res) {
        try {
            if (
                process.env.NODE_ENV === "development" ||
                process.env.NODE_ENV === "production"
            ) {
                var accessToken = req.body.accessToken;
                var fromdate = req.body.fromdate
                var todate = req.body.todate

            } else {
                var accessToken = req.query.accessToken;
            }
            if (!accessToken) {
                //Token not found!
                return res.status(403).send(StringConstant.TOKEN_MISSING);
            }
            //decode the payload
            try {

                const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
                if (decodedAccessToken) {
                    //Find the user name from the token 
                    const username = decodedAccessToken.username
                    const fromDateFormat = moment(new Date(fromdate)).format('YYYY-MM-DD')
                    const fromDate = new Date(fromDateFormat)
                    const toDateFormat = moment(new Date(todate)).format('YYYY-MM-DD')
                    const toDate = new Date(toDateFormat)
                    const hotel = Hotel.findOne({ username }, function (err, hotel) {
                        if (!hotel) {
                            res.status(httpStatusCode.UNAUTHORIZED).send({
                                success: false,
                                message: authStringConstant.USER_DOES_NOT_EXIST
                            });
                        } else if (err) {
                            res.status(httpStatusCode.UNAUTHORIZED).send({
                                success: false,
                                error: err
                            });
                        }
                        else {
                            Bookings.find({ hotel: hotel._id, "check_in": { $gte: fromDate, $lte: toDate } }, function (err, checkIns) {
                                if (err) {
                                    res.status(httpStatusCode.UNAUTHORIZED).send({
                                        success: false,
                                        message: err
                                    });
                                } else {
                                    Bookings.find({ hotel: hotel._id, "check_out": { $gte: fromDate, $lte: toDate } }, function (err, checkOuts) {
                                        if (err) {
                                            res.status(httpStatusCode.UNAUTHORIZED).send({
                                                success: false,
                                                message: err
                                            });
                                        }
                                        else {
                                            res.status(httpStatusCode.OK).send({
                                                checkIn: checkIns,
                                                checkOut: checkOuts
                                            });
                                        }
                                    })
                                }


                            })

                        }
                    })
                } else {
                    return res.status(401).send(StringConstant.INVALID_TOKEN);
                }
            } catch (err) {
                console.log(err)
                return res.status(401).send(StringConstant.INVALID_TOKEN);
            }
        } catch (err) {
            return res.status(401).send({
                err: err.message
            });
        }
    },
    findHotel: async function (req, res) {
        try {
            if (
                process.env.NODE_ENV === "development" ||
                process.env.NODE_ENV === "production"
            ) {
                var accessToken = req.body.accessToken;
            } else {
                var accessToken = req.query.accessToken;
            }
            if (!accessToken) {
                //Token not found!
                return res.status(403).send(StringConstant.TOKEN_MISSING);
            }
            //decode the payload
            try {

                const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
                if (decodedAccessToken) {
                    //Find the user name from the token 
                    const username = decodedAccessToken.username
                    const hotel = Hotel.findOne({ username }, function (err, hotel) {
                        if (err) {
                            res.status(httpStatusCode.UNAUTHORIZED).send({
                                success: false,
                                message: authStringConstant.USER_DOES_NOT_EXIST
                            });
                        }
                        else {
                            res.status(httpStatusCode.OK).send({
                                hotel: hotel
                            });
                        }
                    })
                } else {
                    return res.status(401).send(StringConstant.INVALID_TOKEN);
                }
            } catch (err) {
                return res.status(401).send(StringConstant.INVALID_TOKEN);
            }
        } catch (err) {
            return res.status(401).send({
                err: err.message
            });
        }
    },
    findPrice: async function (req,res){
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
            const { hotel_id, days, category } = req.body;
      
            if (!hotel_id  && !days && !category) {
              res.status(httpStatusCode.BAD_REQUEST).send({
                success: false,
                message: authStringConstant.MISSING_INPUT
              });
            }
            //Get the username from the decoded json web token
      
      
            const room = await Rooms.findOne({ hotel: hotel_id, type: category})
      
            
            if (!room) {
              res.status(httpStatusCode.NO_CONTENT).send({
                success: false,
                message: authStringConstant.ROOM_NOTFOUND
              })
            }
            // Validate if user exist in our database
            else if (room) {
                const roomPrice = room.price * days;
                return res.status(httpStatusCode.OK).send({
                    success: true,
                    price : roomPrice
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
module.exports = findActions;
