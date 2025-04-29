const express = require("express");
const User = require("../models/Users");
const jwt = require('jsonwebtoken');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads/avatars');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename: userId-timestamp.extension
    const fileExt = path.extname(file.originalname);
    const fileName = `${req.params._id}-${Date.now()}${fileExt}`;
    cb(null, fileName);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Helper function to generate JWT token
function generateToken(id, firstName, lastName, email, phoneNumber, role, createdAt, profileImage, bio) {
  const payload = {
    id: id,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    role: role,
    createdAt: createdAt,
    profileImage: profileImage,
    bio: bio
  };
  
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
}

// Upload avatar
router.post('/:_id/avatar', upload.single('avatar'), async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Get the relative path for storage in DB (public/uploads/avatars/filename)
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    
    // Update user with new avatar path
    const updatedUser = await User.findByIdAndUpdate(
      req.params._id,
      { profileImage: avatarPath },
      { new: true }
    );
   
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate new token with updated info including avatar
    const token = generateToken(
      updatedUser._id,
      updatedUser.firstName,
      updatedUser.lastName,
      updatedUser.email,
      updatedUser.phoneNumber,
      updatedUser.role,
      updatedUser.createdAt,
      updatedUser.profileImage,
      updatedUser.bio
    );
    
    // Send the new token back in the response
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: 'Avatar uploaded successfully', token });
    
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Delete a user by _id
router.delete("/:_id", async (req, res) => {
  try {
    // Find the user first to get avatar path if exists
    const user = await User.findById(req.params._id);
    
    if (user && user.profileImage) {
      // Delete the user's avatar file if it exists
      const avatarPath = path.join(__dirname, '../public', user.profileImage);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }
    
    // Delete the user
    await User.findByIdAndDelete(req.params._id);
    res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: Update user by _id
router.put('/:_id', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, bio, profileImage } = req.body;

    // Update the user by _id
    const updatedUser = await User.findByIdAndUpdate(
      req.params._id,
      { firstName, lastName, email, phoneNumber, bio, profileImage },
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
      updatedUser.createdAt,
      updatedUser.profileImage,
      updatedUser.bio
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

    const user = await User.findOne({ email }).select("firstName lastName phoneNumber email role createdAt profileImage bio");

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all users with role 'employee'
router.get("/role/employee", async (req, res) => {
  try {
    const employees = await User.find({ role: "Employee" }).select(
      "firstName lastName phoneNumber email role createdAt profileImage"
    );

    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;