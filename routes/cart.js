const express = require("express");
const router = express.Router();
const { client } = require("../config/db");
const { ObjectId } = require("mongodb");

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

router.get('/:email', async (req, res) => {
    const query = { email: req.params.email }
    const result = await cartCollection.find(query).sort({ _id: -1 }).toArray();
    res.send(result)
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await cartCollection.deleteOne(query);
    res.send(result);
})

module.exports = router;
