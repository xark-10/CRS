const Stripe = require("stripe")
const stripe = Stripe(process.env.STRIPE_SECRET);
const Booking = require('../models/booking')




const stripePayment = {
    payRoute: async function (req, res) {
        try {
            const { email, hotel_id,checkInDate } = req.body;
            Booking.find({ hotel: hotel_id, "check_out": { $gte: checkInDate } },async function (err, foundBookings) {
                if (foundBookings.length === 0 || foundBookings.length < hotel.deluxe) {
                    if (!email) return res.status(400).json({ message: "Please enter a valid email" });
                    const paymentIntent = await stripe.paymentIntents.create({
                        amount: Math.round(25 * 100),
                        currency: "INR",
                        "automatic_payment_methods[enabled]": true,
                        metadata: { email },
                    });
                    const clientSecret = paymentIntent.client_secret;
                    res.json({ message: "Payment initiated", clientSecret });
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

