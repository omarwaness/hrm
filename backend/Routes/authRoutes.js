const express=require("express");
const crypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/Users");
const router=express.Router();

router.post("/register",async(req,res)=>{
    try{
        const{firstName,lastName,phoneNumber,role,email,password}=req.body;
        let user=await User.findOne({email});
        if(user) return res.status(400).json({message:"User already exist"});
        const salt=await crypt.genSalt(10);
        const hashPassword=await crypt.hash(password,salt);
        user=new User({firstName,lastName,phoneNumber,role,email,password:hashPassword});
        await user.save();
        res.status(201).json({message:"User regestred succefully"});

    }catch(err){
        res.status(500).json({message:err.message});

    }}

);
function generateJWT(user){
    const payload={
        id:user._id,
        firstName:user.firstName,
        lastName:user.lastName,
        phoneNumber:user.phoneNumber,
        role:user.role,
        email:user.email,
        createAt:user.createdAt
    }
    token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1h"})
    return token


}

router.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user) return res.status(404).json({message:"User not found"});
        const isMatch=await crypt.compare(password,user.password);
        if(!isMatch) return res.status(500).json({message:'password dosnèt match'});
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
module.exports=router;