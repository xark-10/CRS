// Required dependencies:
const express = require('express')
const router = express.Router()
const authActions = require('../controllers/authController')
const hotelActions = require('../controllers/hotelController')
const bookingController = require('../controllers/bookingController')
const findActions = require('../controllers/findActions')
const auth = require("../middleware/auth");

/*
 * Ping route
 * @route GET /
 */
router.get("/", authActions.pingRoute);

/*
 * Landing Page Route - Home/Welcome
 * @route GET /home
 */
router.get("/home", auth, authActions.homePageRoute);

/*
 * logout an active user
 * @route GET /logoutUser
 */
router.get("/logoutUser",auth, authActions.logoutUser);

/*
 * Registering a new customer
 * @route POST /registerCustomer
 */
router.post("/registerCustomer", authActions.registerNewCustomer);

/*
 * Registering a new Hotel
 * @route POST /registerHotel
 */
router.post("/registerHotel", hotelActions.registerNewHotel);

/*
 * Authenticate and login an existing customer
 * @route POST /loginCustomer
 */
router.post("/loginCustomer", authActions.loginExistingCustomer);

/*
 * Authenticate and login an existing hotel
 * @route POST /loginHotel
 */
router.post("/loginHotel", hotelActions.loginExistingHotel);

/*
 * Provide and Update new access token
 * @route POST /renewAccessToken
 */
router.post("/renewAccessToken", authActions.renewAccessToken);


router.post("/newBooking", auth,bookingController.newBooking);


router.post("/newRoom",auth, hotelActions.newRoom);

router.get("/findHotels", findActions.findHotels);


/*
 * Navigating to the error page
 * This should be the last route else any after it won't work
 */
router.all("*", authActions.errorPageRoute);

module.exports = router

