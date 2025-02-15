const express = require("express");
const router = express.Router();
const { client } = require("../config/db");
// const { ObjectId } = require('mongodb');
// const { verifyToken, verifyAdmin } = require("../middleware/auth");

const employeeCollection = client.db("EmployeeManagement").collection("employeesSalary");

// employee First Payment Save MongoDB in Admin
router.post('/', async (req, res) => {
    try {
        const firstPayment = req.body;
        const result = await employeeCollection.insertOne(firstPayment); // Add await
        res.send(result); // This will now contain insertedId
    } catch (error) {
        console.error("Error inserting payment:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});



module.exports = router;