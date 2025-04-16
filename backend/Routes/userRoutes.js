const express = require("express");
const User = require("../models/Users");
const router = express.Router();

// GET user by email with selected fields
router.get("/:email", async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email }).select("firstName lastName phoneNumber email role createdAt");

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
