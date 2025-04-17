/*const express = require("express");
const Leave = require("../models/Leaves");

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 })
    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create a new leave request
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

// Update leave status (approve/reject)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave request not found" })
    }

    res.status(200).json(updatedLeave)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// Delete a leave request
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Leave.findByIdAndDelete(req.params.id)

    if (!deleted) {
      return res.status(404).json({ message: "Leave request not found" })
    }

    res.status(200).json({ message: "Leave request deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

module.exports = router*/
const express=require("express");
const Leave=require("../models/Leaves");
const router=express.Router();

router.get('/',async(req,res)=>{
  try{
    const leaves=await Leave.find().sort({createdAt:-1})
    res.status(200).json(leaves);

  }catch(err)
  {
    res.status(500).json({messsage:err.message})
  }
})

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


module.exports=router;
