const express = require("express");
const router = express.Router();
const { client } = require("../config/db");
// const { ObjectId } = require('mongodb');
// const { verifyToken, verifyAdmin } = require("../middleware/auth");

const employeeCollection = client.db("EmployeeManagement").collection("employeesSalary");


// Employee First Payment Save in MongoDB (Admin)
router.post('/', async (req, res) => {
    try {
        const firstPayment = {
            ...req.body, 
            lastSalaryPaid: new Date()  
        };

        const result = await employeeCollection.insertOne(firstPayment);
        res.send(result);
    } catch (error) {
        console.error("Error inserting payment:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});




module.exports = router;