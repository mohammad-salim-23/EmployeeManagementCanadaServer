const express = require("express");
const router = express.Router();
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { client } = require("../config/db");
const { ObjectId } = require("mongodb");

// Function to check unpaid salaries
async function checkUnpaidSalaries() {
    try {
        const employeeCollection = client.db("EmployeeManagement").collection("employeesSalary");
        const employees = await employeeCollection.find({}).toArray();

        if (!employees.length) {
            console.log("No employees found.");
            return;
        }

        const today = new Date();

        for (const employee of employees) {
            if (!employee.lastSalaryPaid) {
                console.log(`No salary data found for ${employee.name}`);
                continue;
            }

            const lastSalaryDate = new Date(employee.lastSalaryPaid);
            const differenceInDays = Math.floor((today - lastSalaryDate) / (1000 * 60 * 60 * 24));

            console.log(`Name: ${employee.name}`);
            console.log(`Last Salary Paid Date: ${lastSalaryDate.toISOString()}`);

            if (differenceInDays >= 7) {
                await sendEmailToAdmin(employee.name, employee.email);
                await employeeCollection.updateOne(
                    { _id: new ObjectId(employee._id) },
                    { $set: { status: "Not Paid" } }
                );
                console.log(`Status updated to "Not Paid" for ${employee.name}`);
            } else {
                console.log(`${employee.name}'s salary is already paid.`);
            }
        }
    } catch (error) {
        console.error("Error checking salaries:", error);
    }
}

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS,
    }
});

// Function to send email notification to the admin
async function sendEmailToAdmin(employeeName, employeeEmail) {
    const adminEmail = "salimintelligency@gmail.com";

    let mailOptions = {
        from: process.env.SMTP_MAIL,
        to: adminEmail,
        subject: "Unpaid Salary Alert!",
        text: `The following employee hasn't been paid for 7 days: Name: ${employeeName}, Email: ${employeeEmail}`
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent to admin successfully!");
}

// Schedule the salary check to run every day at midnight
cron.schedule("0 0 * * *", checkUnpaidSalaries);

// Route to manually trigger the salary check
router.get("/", async (req, res) => {
    await checkUnpaidSalaries();
    res.send("Salary check completed.");
});

// Route to fetch all employee salary data
router.get("/employees", async (req, res) => {
    try {
        const employeeCollection = client.db("EmployeeManagement").collection("employeesSalary");
        const employees = await employeeCollection.find().toArray();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
    }
});

module.exports = router;
