const { client } = require("../config/db");
const jwt = require("jsonwebtoken");
const usersCollection = client.db("EmployeeManagement").collection("users");

// const verifyToken = (req, res, next) => {
//   // console.log("Authorization Header:", req.headers.authorization);
//   if (!req.headers.authorization) {
//     return res.status(401).send({ message: 'unauthorized access' })
//   }
//   const token = req.headers.authorization.split(' ')[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: 'unauthorized access' })
//     }
//     req.decoded = decoded;
//     next();
//   })
// }


// const verifyAdmin = async (req, res, next) => {
//   try {
//     const email = req.decoded.email;
//     console.log("admin email test",email)
//     const query = { email: email };
//     const user = await usersCollection.findOne(query);
//     console.log("User found:", user); // Log the user data to check

//     if (!user) {
//       return res.status(401).send({ message: 'User not found' });
//     }

//     const isAdmin = user?.status === 'admin';
//     if (!isAdmin) {
//       return res.status(403).send({ message: 'Forbidden access' });
//     }
//     next();
//   } catch (error) {
//     console.error("Error verifying admin:", error);
//     return res.status(500).send({ message: 'Internal Server Error' });
//   }
// }

// const verifyAdmin = async (req, res, next) => {
//   const email = req.decoded.email;
//   const query = { email: email };
//   const user = await usersCollection.findOne(query);
//   const isAdmin = user?.status === 'admin';
//   if (!isAdmin) {
//     return res.status(403).send({ message: 'forbidden access true' });
//   }
//   next();
// }



// module.exports = { verifyToken, verifyAdmin }; 