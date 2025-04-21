const express = require("express");
const Resignation = require("../models/Resignation");
const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { sender, firstName, lastDay, reason } = req.body;

    const newResignation = new Resignation({
      sender,
      firstName,
      lastDay,
      reason,
    });

    await newResignation.save();
    res.status(201).json(newResignation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
