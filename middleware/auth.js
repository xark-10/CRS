//Required Dependencies
const jwt = require("jsonwebtoken");
const { decode } = require("punycode");
// const { REQUEST_ENTITY_TOO_LARGE } = require("../constants/httpStatusCodes");
const StringConstant = require("../constants/strings");
const User = require('../models/user')
const redisClient = require('../database/redisConnection')
const config = process.env;
require("dotenv").config();

//Middleware to verify token
const verifyToken = async function (req, res, next) {
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
  try {
    //Decode the found token and verify
    const decodedAccessToken = jwt.verify(accessToken, config.ACCESS_TOKEN_KEY);
    const userName = decodedAccessToken.username
    
    redisClient.get('BL_' + userName.toString(),(err,data)=>{
      if (data === accessToken){
        return res.status(401).send(StringConstant.INVALID_TOKEN); 
      }else if(decodedAccessToken){
        req.user = decodedAccessToken;
      }else{
        return res.status(401).send(StringConstant.INVALID_TOKEN);
      }
      if(err) {
        console.log(err.message)
      }
    })
  } catch (err) {
    //Response for Invalid token
    return res.status(401).send(StringConstant.INVALID_TOKEN);
  }
  return next();
};

module.exports = verifyToken;
