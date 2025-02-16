const express = require("express");
const router = express.Router();
const { client } = require("../config/db");
const nodemailer = require('nodemailer');
// const { verifyToken, verifyAdmin } = require("../middleware/auth");

const employeeCollection = client.db("EmployeeManagement").collection("employeesSalary");

// Route to fetch all employee salary data
router.get("/", async (req, res) => {
    try {
        const employeeCollection = client.db("EmployeeManagement").collection("employeesSalary");
        const employees = await employeeCollection.find().sort({ _id: -1 }).toArray(); // Sort employees by ID in descending order
        res.json(employees); // Send employees data as JSON response
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error }); // Handle errors
    }
});

router.get('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        console.log("Searching for email:", email);

        // employeeEmail ফিল্ডে সার্চ করা হচ্ছে
        const query = { employeeEmail: { $regex: new RegExp(`^${email}$`, "i") } };
        const employee = await employeeCollection.findOne(query);

        console.log("employee found:", employee);

        if (!employee) {
            return res.status(404).send({ message: "This is Not Employee Email." });
        }

        res.send(employee);

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});




// Configuring the email transporter for sending emails
const transporter = nodemailer.createTransport({
    service: "gmail", // Using Gmail service
    host: process.env.SMTP_HOST, // Host for SMTP server
    port: process.env.SMTP_PORT, // Port for SMTP server
    secure: false, // Whether to use SSL/TLS
    auth: {
        user: process.env.SMTP_MAIL, // Email for authentication
        pass: process.env.SMTP_PASS, // Password for email authentication
    }
});

// Function to send an email to the employee about their salary update
async function sendEmailToEmployee(employeeEmail, newSalary) {
    let mailOptions = {
        from: process.env.SMTP_MAIL, // Sender's email
        to: employeeEmail, // Recipient's email
        subject: "Your Salary Update", // Subject of the email
        text: `Your salary has been Sending Please Confirm In Your Account. Your new salary is: ${newSalary} BDT.` // Email body text
    };

    try {
        await transporter.sendMail(mailOptions); // Send email using the transporter
        console.log("Email successfully sent to the employee!");

        // After sending the email, update the employee's status to "Pending"
        await employeeCollection.updateOne(
            { employeeEmail: employeeEmail },
            { $set: { status: "Pending" } } // Set status to Pending
        );
    } catch (error) {
        console.error("Error sending email:", error); // Handle email sending errors
    }
}
// Route patch: For updating the salary
router.patch("/update-salary", async (req, res) => {
    const { email, newSalary } = req.body; // Extract email and newSalary from the request body

    if (!email || !newSalary) {
        return res.status(400).json({ message: "Email and new salary are required" }); // Validate input
    }

    try {
        const result = await employeeCollection.updateOne(
            { employeeEmail: email }, // Find the employee by email
            {
                $set: {
                    employeeSalary: newSalary, // Update salary
                    lastSalaryPaid: new Date() // Update lastSalaryPaid with current timestamp
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Employee not found" }); // If employee not found
        }

        // Sending email to the employee once salary is updated
        await sendEmailToEmployee(email, newSalary);

        res.json({ message: 200
            
         }); // Success response
    } catch (error) {
        console.error("Database update error:", error); // Handle database update errors
        res.status(500).json({ message: "Error updating salary", error }); // Send error response
    }
});

module.exports = router;
