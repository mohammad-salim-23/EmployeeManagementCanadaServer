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
  user.role = 'customer';
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


// role base Customer Check 
router.get('/api/v1/role/:email', async (req, res) => {
  const email = req.params.email;

  // Token er email er sathe milay dekha hocche
  // if (email !== req.decode.email) {
  //   return res.status(403).send({ message: "Email doesn't match. Unauthorized" });
  // }

  try {
    const query = { email: email };
    const user = await usersCollection.findOne(query);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send(user);

  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
});





// Make Salary Update
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const { role } = req.body;

  const filter = { _id: new ObjectId(id) };

  // Construct the update document
  const updateDoc = {
    $set: {
      role,
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
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await usersCollection.deleteOne(query);
  res.send(result);
})



module.exports = router;