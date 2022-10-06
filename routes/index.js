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
const swaggerJSDoc=require('swagger-jsdoc');
const swaggerUI=require('swagger-ui-express');
const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb('invalid image file!', false);
    }
  };
const uploads = multer({ storage, fileFilter });
const app = express();
const swaggerOptions={
  definition:{
      openapi:'3.0.0',
      info:{
          title:'Hotel Central Reservation System',
          version:'1.0.0',
          description:'API for Create , View and Book the Hotels',
          contact:{
              name:'Team X Æ A-12',
              email:'mukundanschram944@gmail.com , kishorem168@gmail.com'
          },
          servers:["http://localhost:3000"]
      }
  },
  apis:["./routes/*.js"]
}
const swaggerDocs=swaggerJSDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *  schemas:
 *   Customer:
 *    type: object
 *    properties:
 *     FirstName:
 *      type: string
 *      description: firstname of the Customer
 *      example: 'Peter'
 *     LastName:
 *      type: string
 *      description: Last Name of the Customer
 *      example: 'Parker'
 *     username:
 *      type: string
 *      description: username of the customer
 *      example: 'peterparker12@gmail.com'
 *     password:
 *      type: string
 *      description: secret key provided by the customer
 *      example: '$aY_mY-n@m3'
 *   Vendor:
 *    type: object
 *    properties:
 *     hotelName:
 *      type: string
 *      description: name of the Hotel
 *      example: 'ITC Grand Chola'
 *     username:
 *      type: string
 *      description: username of the hotel
 *      example: 'itchennai@itcgroups.com'
 *     description:
 *      type: string
 *      description: description of the hotel
 *      example: 'With its awe-inspiring size and grandeur, ITC Grand Chola is a veritable destination unto itself. Located in the heart of Chennai the hotel is a palatial tribute to Southern India’s greatest empires – the Imperial Cholas.'
 *     phoneNo:
 *      type: string
 *      description: contact number of the hotel
 *      example: '9876543210'
 *     city:
 *      type: string
 *      description: city where the hotel is located
 *      example: 'Chennai'
 *     town:
 *      type: string
 *      description: town where the hotel is located in the city
 *      example: 'Guindy'
 *     address:
 *      type: string
 *      description: precise address of the hotel
 *      example: '10/7 South street'
 *     starRating:
 *      type: string
 *      description: description of the hotel
 *      example: '4' 
 *   Booking:
 *    type: object
 *    properties:
 *     hotelName:
 *      type: string
 *      description: name of the Hotel
 *      example: 'ITC Grand Chola'
 *     hotel_id:
 *      type: string
 *      description: Unique id generated for the hotel
 *      example: '486518918921'
 *     checkin_date:
 *      type: date
 *      description: customer checkin date
 *      example: '2022-08-02'
 *     checkout_date:
 *      type: date
 *      description: description of the hotel
 *      example: '2022-08-15'
 *     guests_staying:
 *      type: integer
 *      description: guests staying the room
 *      example: '5'
 *     days_staying:
 *      type: integer
 *      description: number of days staying in the hotel
 *      example: '13'
 *     room_type:
 *      type: string
 *      description: type of the room the guests staying
 *      example: 'deluxe'
 *   Hotel:
 *    type: object
 *    properties:
 *     hotelName:
 *      type: string
 *      description: name of the Hotel
 *      example: 'ITC Grand Chola'
 *     city:
 *      type: string
 *      description: city where the hotel is located
 *      example: 'Chennai'
 *   Token:
 *    type: object
 *    properties:
 *     accessToken:
 *      type: string
 *      description: AWT Token generated for the user
 *      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjJkYTcyYTZhNjhjMDAzZWEzNTQ4YmNiIiwidXNlcm5hbWUiOiJraXNob3JlQGdtYWlsLmNvbSIsImlhdCI6MTY1ODY1Njk5NCwiZXhwIjoxNjU4NjYwNTk0fQ.m-cYpAVEwn5VaAX95NubspTFdfoRz_OfQLlbTa3A318'
 *     refreshToken:
 *      type: string
 *      description: AWT Token to get the new Access Token
 *      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjJkYTcyYTZhNjhjMDAzZWEzNTQ4YmNiIiwidXNlcm5hbWUiOiJraXNob3JlQGdtYWlsLmNvbSIsImlhdCI6MTY1ODY1Njk5NCwiZXhwIjoxNjU4NzQzMzk0fQ.Jam9u7nO-fC6V5v-106jrlVzdI-avH_8GYXeMadmuy4'
 *   Payment:
 *    type: object
 *    properties:
 *     hotel_id:
 *      type: string
 *      description: unique id of the Hotel
 *      example: '988318354'
 *     email:
 *      type: string
 *      description: email of the user
 *      example: 'kishore@gmail.com'
 *     type:
 *      type: string
 *      description: type the room booked
 *      example: 'deluxe'
 *     check_in:
 *      type: date
 *      description: Hotel Checkin date
 *      example: '2022-08-02'
 *     price:
 *      type: double
 *      description: Estimated price of the booked room
 *      example: '25000'          
 */

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

/**
  * @swagger
  * /registerCustomer:
  *  post:
  *   summary: creating a new customer login
  *   tags: [Customer functions]
  *   description: customer can create a username and password for their login
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/components/schemas/Customer'
  *   responses:
  *    200:
  *     description: customer registered successfully
  *    500:
  *     description: customer registration failed please try again
  */
/*
 * Registering a new customer
 * @route POST /registerCustomer
 */
router.post("/registerCustomer", authActions.registerNewCustomer);

/**
  * @swagger
  * /registerHotel:
  *  post:
  *   summary: creating a new vendor login
  *   tags: [Vendor functions]
  *   description: hotel vendors can create a username and password for their login
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/components/schemas/Vendor'
  *   responses:
  *    200:
  *     description: customer registered successfully
  *    500:
  *     description: customer registration failed please try again
  */
/*
 * Registering a new Hotel
 * @route POST /registerHotel
 */
router.post("/registerHotel", hotelActions.registerNewHotel);

/*
 * Authenticate and login an existing customer
 * @route POST /loginCustomer
 */

/**
  * @swagger
  * /loginCustomer:
  *  post:
  *   summary: customer login
  *   tags: [Customer functions]
  *   description: customer can login with the provided credentials
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/components/schemas/Customer'
  *   responses:
  *    200:
  *     description: customer logged in succesfully
  *    500:
  *     description: customer login failed please try again
  */
 
router.post("/loginCustomer", authActions.loginExistingCustomer);

/**
  * @swagger
  * /loginHotel:
  *  post:
  *   summary: vendor login
  *   tags: [Vendor functions]
  *   description: vendor can login with the provided credentials
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/components/schemas/Vendor'
  *   responses:
  *    200:
  *     description: Vendor logged in succesfully
  *    500:
  *     description: Vendor login failed please try again
  */
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

/**
  * @swagger
  * /newBooking:
  *  post:
  *   summary: hotel booking
  *   tags: [Customer functions]
  *   description: Booking the desired hotel with checkin and checkout date
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/components/schemas/Booking'
  *   responses:
  *    200:
  *     description: Hotel Booked succesfully
  *    500:
  *     description: Hotel Booking failed please try again
  */
/*
 * Authenticate and create new Booking
 * @route POST /newBooking
 */
router.post("/newBooking", auth,bookingController.newBooking);

/**
  * @swagger
  * /newRoom:
  *  post:
  *   summary: adding new rooms to the booking
  *   tags: [Vendor functions]
  *   description: hotel vendors can add new rooms on different categories for booing
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/components/schemas/Vendor'
  *   responses:
  *    200:
  *     description: customer registered successfully
  *    500:
  *     description: customer registration failed please try again
  */

/*
 * Authenticate and create new Room
 * @route POST /newRoom
 */
router.post("/newRoom",auth, hotelActions.newRoom);

/**
 * @swagger
 * /findHotels:
 *   get:
 *     summary: Find Hotels by Location
 *     tags: [Find Hotels]
 *     parameters:
 *       - in: path
 *         name: location
 *         schema:
 *           type: string
 *         required: true
 *         description: Hotel Location
 *     responses:
 *       200:
 *         description: Hotels Found
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       404:
 *         description: The Hotel was not found
 */
/*
 * Find hotels based on search
 * @route GET /findHotels
 */
router.get("/findHotels", findActions.findHotels);

/**
  * @swagger
  * /findUser:
  *  post:
  *   summary: Finding the user Details
  *   tags: [Customer functions]
  *   description: Getting the user details with the generated tokens
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/components/schemas/Tokens'
  *   responses:
  *    200:
  *     description: User Found
  *    500:
  *     description: Invalid Token
  */
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

/**
  * @swagger
  * /bookingHistory:
  *  post:
  *   summary: Finding the user's Booking History
  *   tags: [Customer functions]
  *   description: Getting the user's Booking details with the generated tokens
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/components/schemas/Tokens'
  *   responses:
  *    200:
  *     description: Bookings Found
  *    500:
  *     description: User has no bookings
  */
/*
 * Fetch user details
 * @route GET /bookingHistory
 */
router.post("/bookingHistory",auth, findActions.bookingHistory);

/**
  * @swagger
  * /findBookings:
  *  post:
  *   summary: getting all the booking details within a range
  *   tags: [Vendor functions]
  *   description: Vendors to get the booking details of their hotel
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/components/schemas/Bookings'
  *   responses:
  *    200:
  *     description: Bookings Found
  *    500:
  *     description: No Bookings Found
  */

/*
 * Find bookings
 * @route POST /findBookings
 */
router.post("/findBookings", auth, findActions.findBookings);

/**
  * @swagger
  * /findPrice:
  *  post:
  *   summary: Getting the estimated price for the booked hotel room
  *   tags: [Customer functions]
  *   description: Room Price based on the category and number of days staying in the Hotel
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/components/schemas/Bookings'
  *   responses:
  *    200:
  *     description: Estimated Price
  *    500:
  *     description: Invalid input
  */

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

/**
  * @swagger
  * /pay:
  *  post:
  *   summary: Payment gateway for the customer to pay for the booking
  *   tags: [Payment Gateway]
  *   description: to pay for the desired hotel room
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/components/schemas/Payment'
  *   responses:
  *    200:
  *     description: Payment Successful
  *    500:
  *     description: Payment Failed
  */

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

app.listen(8000,()=>{
  console.log("swagger docs port listening in port 8000");
})
module.exports = router

