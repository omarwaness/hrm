const express = require("express");
const Message = require("../models/Messages");
const Users = require('../models/Users');
const router = express.Router();
const { Server } = require('socket.io');

function initSocket(server) {
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000", 
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
      }
    });
    
    io.on('connection', (socket) => {
        const email = socket.handshake.query.email;
        console.log(`User connected: ${email}, socket id: ${socket.id}`);
        
        if(email) {
            socket.join(email);
        }
        
        socket.on('newMessage', async (messageData) => {
            try {
              // Make sure we're using receiver, not reciver
              const { sender, receiver, content } = messageData;
              const newMessage = await Message.create({ 
                sender, 
                receiver, // Store as receiver in the database
                content 
              });
              
              // Emit to the receiver using the correct field name
              io.to(newMessage.receiver).emit('message', { 
                type: 'NEW_MESSAGE', 
                payload: newMessage 
              });
              
              console.log('New message saved and emitted:', newMessage._id);
            } catch (err) {
              console.error('Error saving new message:', err);
            }
        });
        
        socket.on('deleteMessage', async (id) => {
            try {
              const deletedMessage = await Message.findByIdAndDelete(id);
              if (deletedMessage) {
                // Use the correct field name to emit to the receiver
                io.to(deletedMessage.receiver).emit('message', { 
                  type: 'MESSAGE_DELETED', 
                  payload: id 
                });
                console.log('Message deleted and emitted:', id);
              }
            } catch (err) {
              console.error('Error deleting message:', err);
            }
        });
    });
    
    return io;
}

router.get("/", async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post("/create", async (req, res) => {
    try {
      
      const { sender, receiver, content } = req.body; 
      const target = await Users.findOne({ email: receiver });
           
      if (!target) {
        return res.status(404).json({ message: 'Receiver not found' }); 
      }
  
      
      const newMessage = new Message({ sender, receiver, content }); 
      await newMessage.save();
      
      res.status(200).json(newMessage);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        
        // Fix: Use "receiver" instead of "reciver"
        const messages = await Message.find({ receiver: email });

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.put('/:id/starred', async (req, res) => {
    try {
        const id = req.params.id;
        
        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        
        message.favorite = !message.favorite;
        
        
        await message.save();
        
        res.status(200).json(message);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = { router, initSocket };