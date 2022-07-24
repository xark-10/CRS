  // Required dependencies:
const logger = require('../config/logger.js')
const jwt = require('jsonwebtoken')
const authStringConstant = require('../constants/strings')
const User = require('../models/user')
const httpStatusCode = require('../constants/httpStatusCodes');
const bcrypt = require('bcrypt')
const passwordSchema = require('../validator/passwordValidator')
const emailValidator = require('../validator/emailValidator');
const redisClient = require('../database/redisConnection')
const { decode } = require('punycode');


// Authentication Controller Commands:
const authActions = {
  // Registration function:
  registerNewCustomer: async function (req, res) {
    try {
      const { username, password, verifyPassword, firstName, lastName, } = req.body
      // Email and Password Validator
      const { valid, reason, validators } = await emailValidator(username)
      const isPasswordValid = passwordSchema.validate(password)

      // To check if all the required fields are provided
      if (!username || !password || !verifyPassword || !firstName || !lastName) {
        return res.status(httpStatusCode.CONFLICT).send({
          success: false,
          message: authStringConstant.MISSING_FIELDS,
        });
      }
      // To verify if userName is a valid email id has been provided
      else if (!valid) {
        return res.status(httpStatusCode.CONFLICT).send({
          success: false,
          message: authStringConstant.INVALID_EMAIL,
          reason: validators[reason].reason
        });
      }
      //  If the password doesn't meet the conditions returns error message
      else if (!isPasswordValid) {
        return res.status(httpStatusCode.CONFLICT).send({
          success: false,
          message: authStringConstant.PASSWORD_INVALID,
        });
      }
      // To check if password and verify password match
      else if (password != verifyPassword) {
        return res.status(httpStatusCode.CONFLICT).send({
          success: false,
          message: authStringConstant.PASSWORD_MISMATCH,
        });
      }
      // Perform - Registering a Customer
      else if (valid & isPasswordValid & (password === verifyPassword)) {

        // check if user already exist
        const oldUser = await User.findOne({ username })

        // To check if user already exists
        if (oldUser) {
          return res.status(httpStatusCode.CONFLICT).send({
            success: false,
            message: authStringConstant.USER_EXIST,
          });
        } else {
          // Creates a object based on the user schema
          var newCustomer = User({
            username: username,
            email: username,
            password: password,
            lastName: lastName,
            firstName: firstName,
          });
          // Performs the save option the schema
          newCustomer.save(function (err, newCustomer) {
            if (err) {
              return res.status(httpStatusCode.CONFLICT).send({
                success: false,
                message: authStringConstant.FAILURE_REG,
                error: err.message,
              });
            } else {
              const accessToken = jwt.sign(
                { user_id: newCustomer._id, username },
                process.env.ACCESS_TOKEN_KEY,
                {
                  expiresIn: process.env.ACCESS_TOKEN_TIME,
                }
              );

              const refreshToken = jwt.sign(
                { user_id: newCustomer._id, username },
                process.env.REFRESH_TOKEN_KEY,
                {
                  expiresIn: process.env.REFRESH_TOKEN_TIME,
                }
              );
              // newCustomer.accessToken = accessToken;
              // newCustomer.refreshToken = refreshToken;
              // newCustomer.save()
              redisClient.get(username.toString(), (err, data) => {
                if (err) {
                  console.log(err)
                } else {
                  redisClient.set(username.toString(), JSON.stringify({ accessToken: accessToken, refreshToken: refreshToken }))
                }
              })
              // send the success response with the token
              return res.status(httpStatusCode.OK).send({
                success: true,
                message: authStringConstant.SUCCESSFUL_REG,
                accessToken: accessToken,
                refreshToken: refreshToken,
              });
            }
          });
        }
      }
      else {
        return res.status(httpStatusCode.GATEWAY_TIMEOUT).send({
          success: false,
          message: authStringConstant.UNKNOWN_ERROR,
        });
      }
    } catch (error) {
      console.log(error.message)
      // send proper response
    }
  }, // Register logic ends here

  // Login existing customer
  loginExistingCustomer: async function (req, res) {
    try {
      //Get user input
      const { username, password } = req.body;
      if (!username && !password) {
        res.status(httpStatusCode.BAD_REQUEST).send({
          success: false,
          message: authStringConstant.MISSING_INPUT
        });
      }
      const user = await User.findOne({ username });
      // If user details doesn't exist ask the customer to register
      if (!user) {
        res.status(httpStatusCode.UNAUTHORIZED).send({
          success: false,
          message: authStringConstant.USER_DOES_NOT_EXIST
        });
      }
      // Validate if user exist in our database
      else if (user && (await bcrypt.compare(password, user.password))) {

        const accessToken = jwt.sign(
          { user_id: user._id, username },
          process.env.ACCESS_TOKEN_KEY,
          {
            expiresIn: process.env.ACCESS_TOKEN_TIME,
          }
        );

        const refreshToken = jwt.sign(
          { user_id: user._id, username },
          process.env.REFRESH_TOKEN_KEY,
          {
            expiresIn: process.env.REFRESH_TOKEN_TIME,
          }
        );
        redisClient.get(username.toString(), (err, data) => {
          if (err) {
            console.log(err)
          } else {
            redisClient.set(username.toString(), JSON.stringify({ accessToken: accessToken, refreshToken: refreshToken }))
          }
        })
        res.status(httpStatusCode.OK).send({
          success: true,
          message: authStringConstant.SUCCESSFUL_LOGIN,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

      }
      // If password doesn't match
      else if (user && !(await bcrypt.compare(password, user.password))) {
        res.status(httpStatusCode.BAD_REQUEST).send({
          success: false,
          message: authStringConstant.INVALID_CREDENTIALS
        });
      }
      else {
        res.status(httpStatusCode.GATEWAY_TIMEOUT).send({
          success: false,
          message: authStringConstant.UNKNOWN_ERROR,
        });
      }
    } catch (error) {
      console.log(error.message);
      // send proper response
    }
  }, // Login logic ends here


  // Ping route
  pingRoute: function (req, res) {
    res.status(httpStatusCode.OK).send({
      success: true,
      message: StringConstant.SUCCESSFUL_PING,
    });
  },

  // Home route
  homePageRoute: function (req, res) {
    res.status(httpStatusCode.OK).send({
      success: true,
      message: StringConstant.SUCCESSFUL_HOME,
    });
  },

  // To renew a new accessToken
  renewAccessToken: async function (req, res) {
    //checks the environment and collects the data accordingly
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "production"
    ) {
      var refreshToken = req.body.refreshToken;
    } else {
      var refreshToken = req.query.refreshToken;
    }
    if (!refreshToken) {
      //Token not found!
      return res.status(403).send(StringConstant.TOKEN_MISSING);
    }
    try {
      //Decode the found token and verify
      const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      if (decodedRefreshToken) {
        //Find the user name from the token 
        const username = decodedRefreshToken.username
        redisClient.get(username.toString(), (err, data) => {
          if (data === null) {
            return res.status(401).send(StringConstant.INVALID_TOKEN);
          } else if (JSON.parse(data).refreshToken != refreshToken) {
            return res.status(401).send(StringConstant.TOKEN_MISMATCH);
          }else if(err){
            console.log(err);
            return res.status(401).send({data:err.message});

          }

        })
        //creates new access token
        const accessToken = jwt.sign(
          { user_id: User._id, username },
          process.env.ACCESS_TOKEN_KEY,
          {
            expiresIn: process.env.ACCESS_TOKEN_TIME,
          }
        );
        redisClient.get(username.toString(), (err, data) => {
          if (data) {
            redisClient.set(username.toString(), JSON.stringify({ accessToken: accessToken, refreshToken: refreshToken }))

          }else if(!data){
            return res.status(401).send({ data: err.message });
          } 
          else if (err) {
            return res.status(401).send({ data: err.message });
          }
        })
        return res.status(httpStatusCode.OK).send({
          success: true,
          message: StringConstant.SUCCESSFUL_TOKEN_RENEWAL,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });


      } else {
        return res.status(401).send(StringConstant.INVALID_TOKEN);
      }
    } catch (err) {
      console.log(err)
      //Response for Invalid token
      return res.status(401).send(StringConstant.UNKNOWN_ERROR);
    }
  },

  // To logout an existing customer.
  logoutUser: async function (req, res) {
    try {
      // //checks the environment and collects the data accordingly
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
      
      //Get the username from the decoded json web token
      const username = decodedAccessToken.username
      
      // remove refreshToken
      await redisClient.del(username.toString());
      
      //blacklist current access token
      if (await redisClient.set('BL_' + username.toString(), accessToken)) {
        res.status(httpStatusCode.OK).send({
          success: true,
          message: StringConstant.SUCCESSFUL_LOGOUT,
        });
      } else {
        return res.status(401).send(StringConstant.UNKNOWN_ERROR);

      }

    } catch (err) {
      console.log(err.message);
      return res.status(401).send(StringConstant.UNKNOWN_ERROR);

    }
  },

  // Unidentified route
  errorPageRoute: function (req, res) {
    res.status(httpStatusCode.NOT_FOUND).json({
      success: "false",
      message: StringConstant.PAGE_NOT_FOUND
    });
  },
};

module.exports = authActions;

