const express = require("express");
const router = express.Router();
const { client } = require("../config/db");
// const { verifyToken, verifyAdmin } = require("../middleware/auth");

const employeeCollection = client.db("EmployeeManagement").collection("employeesSalary");

// Route to fetch all employee salary data
router.get("/", async (req, res) => {
    try {
        const employeeCollection = client.db("EmployeeManagement").collection("employeesSalary");
        const employees = await employeeCollection.find().sort({_id:-1}).toArray();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
    }
});


module.exports = router;