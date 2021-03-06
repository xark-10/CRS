// Required dependencies:
const express = require('express')
const router = express.Router()
const authActions = require('../controllers/authController')
const hotelActions = require('../controllers/hotelController')
const bookingController = require('../controllers/bookingController')
const findActions = require('../controllers/findActions')
const imageActions = require('../controllers/imageController')
const auth = require("../middleware/auth");
const paymentActions = require('../controllers/paymentController')
const multer = require('multer');
const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb('invalid image file!', false);
    }
  };
const uploads = multer({ storage, fileFilter });

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

/*
 * Authenticate and create new Booking
 * @route POST /newBooking
 */
router.post("/newBooking", auth,bookingController.newBooking);

/*
 * Authenticate and create new Room
 * @route POST /newRoom
 */
router.post("/newRoom",auth, hotelActions.newRoom);

/*
 * Find hotels based on search
 * @route GET /findHotels
 */
router.get("/findHotels", findActions.findHotels);

/*
 * Fetch user details
 * @route POST /findUser
 */
router.post("/findUser",auth, findActions.findUser);

/*
 * Fetch user details
 * @route POST /findUser
 */
router.post("/findHotel",auth, findActions.findHotel);

/*
 * Fetch user details
 * @route GET /bookingHistory
 */
router.post("/bookingHistory",auth, findActions.bookingHistory);

/*
 * Find bookings
 * @route POST /findBookings
 */
router.post("/findBookings", auth, findActions.findBookings);

/*
 * Find hotel price
 * @route POST /findprice
 */

router.post("/findprice", findActions.findPrice);

/*
 * To fetch client secret
 * @route POST /stripe
 */
router.post("/stripe", paymentActions.stripeRoute)
/*
 * To make payments
 * @route POST /pay
 */
router.post("/pay", paymentActions.payRoute)

/*
 * Upload profile pic
 * @route POST /uploadProfile
 */

router.post(
    '/uploadProfile',
    auth,
    uploads.single('profile'),
    imageActions.profileImageUpload
  );




/*
 * Navigating to the error page
 * This should be the last route else any after it won't work
 */
router.all("*", authActions.errorPageRoute);


module.exports = router

