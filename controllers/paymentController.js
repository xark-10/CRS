const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SECRET);
const Rooms = require('../models/rooms')
const Hotel = require('../models/hotel')
const Booking = require('../models/booking')
const httpStatusCode = require('../constants/httpStatusCodes');
const authStringConstant = require('../constants/strings')
const moment = require('moment')



const stripePayment = {
    payRoute: async function (req, res) {
        try {
            const { email, hotel_id, check_in, type, price} = req.body;
            const hotel = await Hotel.findOne({ _id: hotel_id })

        

            let categoryCount = 0
            if (type === 'couple') {
                categoryCount = hotel.couple
                console.log(categoryCount)
            } else if (type === 'single') {
                categoryCount = hotel.single

            } else if (type === 'superDeluxe') {
                categoryCount = hotel.doublecart

            } else if (type === 'deluxe') {
                categoryCount = hotel.deluxe

            } else if (type === 'luxury') {
                categoryCount = hotel.luxury

            } else {
                categoryCount = null
            }
            const checkInDateFormat = moment(new Date(check_in)).format('YYYY-MM-DD');
            const checkInDate = new Date(checkInDateFormat)
            if (!email) return res.status(400).json({ message: "Please enter a valid email" });
            Booking.find({ hotel: hotel._id, "check_out": { $gte: checkInDate } },async function (err, foundBookings) {
                if (foundBookings.length === 0 || foundBookings.length < categoryCount) {
                    const paymentIntent = await stripe.paymentIntents.create({
                        amount: price * 100,
                        currency: "INR",
                        "automatic_payment_methods[enabled]": true,
                        metadata: { email },
                    });
                    const clientSecret = paymentIntent.client_secret;
                    res.json({ message: "Payment initiated", clientSecret });
                } else {
                    res.status(httpStatusCode.GATEWAY_TIMEOUT).send({
                        success: false,
                        message: authStringConstant.ROOM_BOOKED,
                    });
                }
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Internal server error",
                error: err
            });
        }
    },
    stripeRoute: async function (req, res) {
        const sig = req.headers["stripe-signature"];
        let event;
        try {
            event = await stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message });
        }
        // Event when a payment is initiated
        if (event.type === "payment_intent.created") {
            console.log(`${event.data.object.metadata.name} initated payment!`);
        }
        // Event when a payment is succeeded
        if (event.type === "payment_intent.succeeded") {
            console.log(`${event.data.object.metadata.name} succeeded payment!`);
            // fulfilment
        }
        res.json({ ok: true });
    }
}

module.exports = stripePayment

