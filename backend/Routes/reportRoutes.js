const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// @route   POST /reports
// @desc    Create and save a new report
// @access  Public or protected (adjust as needed)
router.post("/", async (req, res) => {
  try {
    const {
      employeeEmail,
      employeeFirstName,
      employeeLastName,
      totalRequests,
      breakdown,
    } = req.body;

    const newReport = new Report({
      employeeEmail,
      employeeFirstName,
      employeeLastName,
      totalRequests,
      breakdown,
    });

    await newReport.save();
    res.status(201).json({ message: "Report saved successfully." });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ error: "Failed to save report." });
  }
});

// Get all reports
router.get("/", async (req, res) => {
    try {
      const reports = await Report.find().sort({ createdAt: -1 })
      res.status(200).json(reports)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })



module.exports = router;
