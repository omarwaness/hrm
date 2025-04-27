const express=require("express");
const User=require("../models/Users");
const jwt=require('jsonwebtoken')
const router=express.Router();

// DELETE: Delete a user by _id
router.delete("/:_id", async (req, res) => {
    try {
      // Find the user by _id and delete
      await User.findByIdAndDelete(req.params._id);
      res.status(200).json({ message: "User successfully deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

function generateToken(id,firstName,lastName,email,phoneNumber,role,createdAt){
    const payload={
        id:id,
        firstName:firstName,
        lastName:lastName,
        email:email,
        phoneNumber:phoneNumber,
        role:role,
        createdAt:createdAt
    }
    const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1h"})
    
    return token

}

router.put('/:_id', async (req, res) => {
    try {
      const { firstName, lastName, email, phoneNumber, role, createdAt } = req.body;
  
      // Update the user by _id
      const updatedUser = await User.findByIdAndUpdate(
        req.params._id,
        { firstName, lastName, email, phoneNumber, role, createdAt },
        { new: true } // Ensure you get the updated document
      );
  
      // If user not found
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Generate new token with updated info
      const token = generateToken(
        updatedUser._id,
        updatedUser.firstName,
        updatedUser.lastName,
        updatedUser.email,
        updatedUser.phoneNumber,
        updatedUser.role,
        updatedUser.createdAt
      );
  
      // Send the new token back in the response
      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ message: "Updated successfully", token });
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
// GET user by email with selected fields
router.get("/:email", async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email }).select("firstName lastName phoneNumber email role createdAt");

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// GET all users with role 'employee'
router.get("/role/employee", async (req, res) => {
    try {
      const employees = await User.find({ role: "Employee" }).select(
        "firstName lastName phoneNumber email role createdAt"
      );
  
      res.status(200).json(employees);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});
  


router.get("/",async(req,res)=>{
    try{
        const users=await User.find();
        res.json(users)
    }catch(err){
        res.status(500).json({error:err.message})
    }
})
module.exports = router;
