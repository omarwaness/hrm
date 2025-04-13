const express=require("express")
const User=require('../models/Users')
const router=express.Router()
const crypt=require('bcrypt')

router.get("/:email",async(req , res)=>
{
    try{
        const user=await User.find();
        if(user){res.status(200).json(user)}
        else{
            res.status(404).json({message:"user not found"})
        }
        

    }catch(err){
        res.status(500).json({message:err.message})
    }
})