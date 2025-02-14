const express = require("express");
const router = express.Router();
const { client } = require("../config/db");
const { ObjectId } = require('mongodb');
// const { verifyToken, verifyAdmin } = require("../middleware/auth");

const usersCollection = client.db("EmployeeManagement").collection("users");

// Show all Users
router.get("/", async (req, res) => {
  const result = await usersCollection.find().sort({ _id: -1 }).toArray();
  res.send(result);
});

// // User account create
router.post('/', async (req, res) => {
  const user = req.body;
  user.status = 'user';
  // insert email id users doesn't exist
  const query = { email: user.email };
  const existingUser = await usersCollection.findOne(query);
  if (existingUser) {
    // console.log(existingUser);
    return res.send({ message: 'user already exists', insertedId: null })
  }
  const result = usersCollection.insertOne(user);
  res.send(result);
})


// Admin Check Api (valid Admin Or UnValid Admin)
// router.get('/admin/:email', async (req, res) => {
//   const email = req.params.email;
//   // console.log(email)
//   const query = { email: email }
//   const user = await usersCollection.findOne(query);
//   let admin = false;
//   if (user) {
//     admin = user?.status === 'admin'
//   }
//   res.send({ admin });
// })


// Make Admin / user 
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  const filter = { _id: new ObjectId(id) };

  // Construct the update document
  const updateDoc = {
    $set: {
      status,
    },
  };

  try {
    const result = await usersCollection.updateOne(filter, updateDoc);
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .send({ message: "User not found or no changes made" });
    }
    res.send(result);
  } catch (error) {
    // console.error("Error updating user:", error);
    res.status(500).send({ message: "An error occurred", error });
  }
});




// Dashboard users delete
router.delete('/:id',  async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await usersCollection.deleteOne(query);
  res.send(result);
})



module.exports = router;