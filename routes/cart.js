const express = require("express");
const router = express.Router();
const { client } = require("../config/db");

const cartCollection = client.db("EmployeeManagement").collection("cart");

router.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        const result = await cartCollection.insertOne(newProduct);
        res.status(201).json({ message: "Product added successfully", success: true, insertedId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: "Error adding product", success: false, error });
    }
});

router.get("/", async (req, res) => {
    try {
        const products = await cartCollection.find().toArray();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
});

module.exports = router;
