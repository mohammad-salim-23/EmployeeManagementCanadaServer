const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { connectDB } = require("./config/db");

const http = require("http");
const userRoutes = require("./routes/users")
const sevenDayCheckRoute = require("./routes/sevenDayCheck");
const productRoutes = require("./routes/products")
const firstPaymentRoutes = require("./routes/firstPayment")
const paymentHistoryRoutes = require("./routes/paymentHistory")
const salaryPayRoutes = require("./routes/salaryPay")
const cartRoute = require("./routes/cart")
const salaryStatusConfirmRoute = require("./routes/salaryStatusConfirm")



const app = express();
const port = process.env.PORT || 8000;


// Create an HTTP server
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





// Connect to the database
connectDB();




// app.post("/jwt", async (req, res) => {
//   const user = req.body;
//   // console.log("jwt...test", user);
//   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: "1h",
//   });
//   // console.log("check Token", token)
//   res.send({ token });
// });


// Use routes
app.use("/users", userRoutes);
app.use("/sevenDayCheck", sevenDayCheckRoute);
app.use("/products",productRoutes);
app.use("/firstPayment",firstPaymentRoutes);
app.use("/api/v1/paymentHistory", paymentHistoryRoutes);
app.use("/api/v1/salaryPay", salaryPayRoutes);
app.use('/cart', cartRoute)
app.use('/api/v1/salaryConfirm', salaryStatusConfirmRoute)



// Root endpoint
app.get("/", (req, res) => {
  res.send("Employee Management Server Running");
});


// Start the server
server.listen(port, () => {
  console.log(`Employee Management sitting on server port ${port}`);
});


// Handle unhandled rejections and uncaught exceptions
process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});


process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error:", err);
});
