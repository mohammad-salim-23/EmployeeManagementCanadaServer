const express = require("express");
const router = express.Router();
const { client } = require("../config/db");
const { ObjectId } = require('mongodb');  

const employeeCollection = client.db("EmployeeManagement").collection("employeesSalary");

// Update Employee Status to "Paid"
router.patch("/update-status", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "ইমেইল প্রয়োজন" });
    }

    try {
        const result = await employeeCollection.updateOne(
            { employeeEmail: email }, // ইমেইল দিয়ে কর্মী খুঁজছি
            { $set: { status: "Paid" } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "কর্মী পাওয়া যায়নি" });
        }


        res.json({ message: "200" });
    } catch (error) {
        console.error("ডেটাবেস আপডেটের সময় সমস্যা:", error);
        res.status(500).json({ message: "আপডেট করতে সমস্যা হয়েছে", error });
    }
});


module.exports = router;
