const express=require("express");
const User=require("../models/Users");
const jwt=require('jsonwebtoken')
const router=express.Router();

router.delete("/:_id",async(req,res)=>{
   
    try{
        await User.findByIdAndDelete(req.params._id);
       res.status(200).json({message:"User sucefuly deleted"})
       
    
    }catch(error){
        res.status(500).json({message:error.message});
    }
})
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
router.put('/:_id',async(req,res)=>{
    try{
        
        const {firstName,lastName,email,phoneNumber,role,createdAt}=req.body;
        let user=await User.findOne({email});
        console.log("cc")       

        const updatedUser=await User.findByIdAndUpdate(
            req.params._id,{
            firstName:firstName,
            lastName:lastName,
            email:email,
            phoneNumber:phoneNumber,
            role:role,
            createdAt:createdAt
        },{new:true})
        
        const token=generateToken(req.params._id,firstName,lastName,email,phoneNumber,role,createdAt)
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({message:'updated succefully',token})

    

    }catch(err){
        res.status(500).json({message:err.message})
    }
})
router.get('/',async (req,res)=>{
    try{
        const users=await User.find();
        res.status(200).json(users)

    }catch(err){
        res.status(500).json({message:err.message})
    }
})
module.exports=router;
