const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    lastName: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    phoneNumber: {
      type: Number,
      required: function () {
        return !this.googleId;
      },
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, unique: true },
    role: {
      type: String,
      enum: ["Admin", "HR", "Employee", "Conditate"],
      default: "Conditate"
    },
    
    profileImage: String,
    confirmed: { type: Boolean, default: false },
    emailActivationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", UserSchema);