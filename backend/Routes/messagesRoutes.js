const express = require("express")
const Message = require("../models/Messages")
const Users=require('../models/Users')
const router = express.Router()

// Get all messages
router.get("/", async (req, res) => {
    try {
        const messages = await Message.find()
        res.status(200).json(messages)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

// Create a new message
router.post("/create", async (req, res) => {
    try {
      const { sender, reciever, content } = req.body; 
      const target = await Users.findOne({ email:reciever });     
      if (!target) {
        return res.status(404).json({ message: 'receiver not found' }); 
      }
  
      const newMessage = new Message({ sender, reciever, content }); 
      await newMessage.save();
      res.status(200).json(newMessage);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Delete a message by ID
router.delete("/:id", async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Message deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});
router.get('/:email',async (req,res)=>{
    try{
        const email=req.params.email
    
        const messages=await Message.find({reciever:email});
        res.status(200).json(messages)
    }catch(err){
        res.status(500).json({messge:err.message})
    }
})


module.exports = router

