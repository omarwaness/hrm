require('dotenv').config();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const async = require("async");
const nodemailer = require("nodemailer");
const express=require("express");
const crypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/Users");
const passport = require('passport')
const router=express.Router();
const { OAuth2Client } = require("google-auth-library");


 
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Ensure this matches your Google Client ID
    });

    const payload = ticket.getPayload();
    return payload;  // Return the payload for further use
  } catch (error) {
    console.error("Google token verification failed:", error);
    throw new Error("Invalid Google token");
  }
}

// Google Auth route
router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const payload = await verifyGoogleToken(token);  // Verify the Google token
    const { sub: googleId, email, name, picture  ,given_name,family_name } = payload;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        picture,
        firstName: given_name,
        lastName: family_name,
        role: "Conditate", // Default role if you want
      });
    }

    // Generate a JWT token with user role
    const jwtToken = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role, // Include the role in the payload
        email: user.email,
        name: user.name,
        picture: user.picture
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send the JWT token with the user's role
    res.json({ token: jwtToken, user });
  } catch (err) {
    res.status(401).json({ message: "Invalid Google token", error: err.message });
  }
});










router.post("/register", async (req, res) => {
  try {
      const { firstName, lastName, phoneNumber, role, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });

      // Hash the password
      const salt = await crypt.genSalt(10);
      const hashPassword = await crypt.hash(password, salt);

      // Create a new user
      user = new User({
          firstName,
          lastName,
          phoneNumber,
          role,
          email,
          password: hashPassword,
      });

      // Save the user to the database
      await user.save();

      // Generate a JWT token
      const token = generateJWT(user);

      // Send the token in the response
      res.status(201).json({ message: "User registered successfully", token });

  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

function generateJWT(user) {
  const payload = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      email: user.email,
      createAt: user.createdAt
  };

  // Sign and generate the JWT token
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
}


router.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user) return res.status(404).json({message:"User not found"});
        const isMatch=await crypt.compare(password,user.password);
        if(!isMatch) return res.status(500).json({message:'password not match'});
        const token = generateJWT(user);
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ message: "Login Successfully", token });
    }catch(err){
                res.status(500).json({message:err.message})
            }
});

router.post("/logout",async(req,res)=>{
    res.cookie("token","",{httpOnly:true,expires:new Date(0)});
    res.status(200).json({message:"Logged out"});
})

router.post("/forgot", async (req, res, next) => {
  try {
    const token = crypto.randomBytes(20).toString("hex");

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "No account with that email exists." });
    }

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const resetLink = `http://${req.headers.host}/api/auth/reset/${token}`;

    const mailOptions = {
      to: user.email,
      from: process.env.GMAIL_USER,
      subject: "Reset Your Password",
      text: `You requested a password reset.\n\nClick the following link:\n${resetLink}\n\nIf you did not request this, ignore this email.`,
    };

    await smtpTransport.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (err) {
    next(err);
  }
});

// Reset password: GET /api/auth/reset/:token (optional for verifying token)
router.get("/reset/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or has expired." });
    }
    res.redirect(`http://localhost:3000/reset/${req.params.token}`);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

// Submit new password: POST /api/auth/reset/:token
router.post("/reset/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    
    if (!user) {
      return res.status(400).json({ message: "Token is invalid or expired." });
    }

    if (req.body.password !== req.body.confirm) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    user.password = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  
    const mailOptions = {
      to: user.email,
      from: process.env.GMAIL_USER,
      subject: "Your password has been changed",
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.`,
    };

    await smtpTransport.sendMail(mailOptions);
    res.status(200).json({ message: "Password has been changed." });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});
  module.exports = router;