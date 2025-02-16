const express = require("express");
const router = express.Router();
const { client } = require("../config/db");
const { ObjectId } = require('mongodb');

const  productsCollection= client.db("EmployeeManagement").collection("products");

// Product Post APi
router.post("/", async (req, res) => {
    try {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.status(201).json({ message: "Product added successfully", insertedId: result.insertedId });
    } catch (error) {
      res.status(500).json({ message: "Error adding product", error });
    }
  });


  // Product get APi
  router.get("/", async (req, res) => {
    try {
      const products = await productsCollection.find().toArray();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products", error });
    }
  });

  router.delete('/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
  })
  module.exports = router;