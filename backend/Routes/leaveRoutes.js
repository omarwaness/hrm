const express = require("express");
const Leave = require("../models/Leaves");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { sender, fromDate, toDate, reason } = req.body

    const newLeave = new Leave({ sender, fromDate, toDate, reason })
    await newLeave.save()

    res.status(201).json(newLeave)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

router.get("/", async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 })
    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/:_id/deny',async(req,res)=>{
  const leave=await Leave.findByIdAndUpdate(
    req.params._id,{
      status:'denided'
    },{new:true}
  )
  console.group("cc")
  res.status(200).json({message:'updated succefully'})
})

router.put('/:_id/approved',async(req,res)=>{
  const leave=await Leave.findByIdAndUpdate(
    req.params._id,{
      status:'approved'
    },{new:true}
  )
  console.group("cc")
  res.status(200).json({message:'updated succefully'})
})

// GET list of leave requests by email
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const requests = await Leave.find({ sender: email }).select("createdAt")

    if (requests.length > 0) {
      res.status(200).json(requests);
    } else {
      res.status(404).json({ message: "No leave requests found for this email" })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


module.exports=router;