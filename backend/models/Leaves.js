const mongoose = require("mongoose")

const LeaveSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum:['pending','approved','denied'], default: "pending" }, 
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Leave", LeaveSchema)
