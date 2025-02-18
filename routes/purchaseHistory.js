const express = require("express");
const router = express.Router();
const { client } = require("../config/db");
const { ObjectId } = require('mongodb');

const purchaseHistoryCollection = client.db("EmployeeManagement").collection("purchaseHistory");

// pur
router.get("/:email", async (req, res) => {
    const email = req.params.email;

    try {
        const query = { email: email };
        const products = await purchaseHistoryCollection.find(query).toArray();  

        if (!products.length) {
            return res.status(404).send({ message: "No products found for this user" });
        }

        res.send(products);

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});


module.exports = router;
