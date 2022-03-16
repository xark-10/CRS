const logger = require('../config/logger.js')
const jwt = require('jsonwebtoken')
const authStringConstant = require('../constants/strings')
const User = require('../models/user')
const Rooms = require('../models/rooms')
const Hotel = require('../models/hotel')
const Booking = require('../models/booking')
const httpStatusCode = require('../constants/httpStatusCodes');


const findActions = {
    findHotels: async function (req, res) {
        try {
            const { city, category, town } = req.body;
            if (!city) {
                res.status(httpStatusCode.BAD_REQUEST).send({
                    success: false,
                    message: authStringConstant.MISSING_INPUT
                });
            } else {
                Hotel.find({ city: city }, function (err, foundHotels) {
                    if (err) {
                        res.status(httpStatusCode.BAD_REQUEST).send({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        res.status(httpStatusCode.OK).send({
                            foundHotels: foundHotels
                        });
                    }
                });
            }
        } catch (err) {
            console.log(err)
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
            try{

                const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
                if (decodedAccessToken) {
                    //Find the user name from the token 
                    const username = decodedAccessToken.username
                    const user = User.findOne({ username }, function (err, user) {
                        console.log(user)
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
            }catch(err){
                return res.status(401).send(StringConstant.INVALID_TOKEN);
            }
        } catch (err) {
            return res.status(401).send({
                err: err.message});
        }
    }
}
module.exports = findActions;
