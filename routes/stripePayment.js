const express = require("express");
const router = express.Router();
const { client } = require("../config/db");
const { ObjectId } = require('mongodb');
const stripe = require("stripe")(process.env.STRIPE_KEY)

const cartCollection = client.db("EmployeeManagement").collection("cart");
const paymentHistoryCollection = client.db("EmployeeManagement").collection("paymentHistory");
// const cartCollection = client.db("EmployeeManagement").collection("cart");


// ================ Stripe Pay USD API =================
// // Stripe intent Api Create with CheckOut Pages
router.post("/create-payment-intent", async (req, res) => {
    const { productIds } = req.body;

    // Convert productIds to ObjectIds
    const objectIds = productIds.map(id => new ObjectId(id));
    const query = {
        _id: { $in: objectIds }
    };

    // Fetch the products from cartCollection
    const products = await cartCollection.find(query).toArray(); // Find products by their IDs
    console.log(products); // Logging the fetched products

    // Calculate total price
    const totalPrice = products.reduce((acc, item) => acc + item.productPrice, 0);
    console.log("Total Price: ", totalPrice);

    // Create payment intent with Stripe
    const amount = parseInt(totalPrice * 100); // Stripe expects amount in cents
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
    });

    // Send the clientSecret to the frontend
    res.send({
        clientSecret: paymentIntent.client_secret,
    });

    // Handle successful payment after Stripe callback (you would handle this in a webhook or another route)
    router.post("/payment-success", async (req, res) => {
        const { paymentIntentId, productIds, userEmail } = req.body;
        console.log("test user email check", userEmail)

        try {
            // Check if payment was successful by verifying the payment intent status
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (paymentIntent.status === "succeeded") {
                // Payment was successful

                // Delete the purchased products from the cartCollection
                const deleteResult = await cartCollection.deleteMany({
                    _id: { $in: productIds.map(id => new ObjectId(id)) }
                });

                console.log(`Deleted ${deleteResult.deletedCount} products from the cart.`);

                // Remove _id field from the products to avoid duplicate key errors when inserting into paymentHistory
                const productsToInsert = products.map(product => {
                    const { _id, ...rest } = product; // Exclude _id field
                    return { ...rest, paymentIntentId, userEmail };; // Return product without _id
                });

                // Insert the products into the paymentHistory collection
                const historyInsertResult = await paymentHistoryCollection.insertMany(productsToInsert);

                console.log(`Inserted ${historyInsertResult.insertedCount} products into payment history.`);

                res.send({ success: true, message: "Payment successful and cart updated." });
            } else {
                res.status(400).send({ success: false, message: "Payment not successful." });
            }
        } catch (error) {
            console.error("Error handling payment success:", error);
            res.status(500).send({ success: false, message: "Internal server error." });
        }
    });

});



module.exports = router;
