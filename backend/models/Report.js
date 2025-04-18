const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    employeeEmail: { type: String, required: true },
    employeeFirstName: { type: String, required: true },
    employeeLastName: { type: String, required: true },
    totalRequests: { type: Number, required: true },
    breakdown: [
      {
        month: String,
        requests: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
