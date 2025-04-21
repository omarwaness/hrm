require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const http = require('http');
const { router: messageRouter, initSocket } = require('./Routes/messagesRoutes');

const app = express();
app.use(express.json());

// Create HTTP server with Express app
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = initSocket(server);

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./Routes/authRoutes"));
app.use("/api/message", messageRouter);
app.use("/api/leave", require("./Routes/leaveRoutes"));
app.use("/api/user", require("./Routes/userRoutes"));
app.use("/api/reports", require("./Routes/reportRoutes"));
app.use("/api/resignation", require("./Routes/ResignationRoutes"));

// Make io available throughout the application
app.set("io", io);

// Start the REST API server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`REST API server listening on port ${PORT}`));

// Start the Socket.IO server on port 5001
server.listen(5001, "0.0.0.0", () => {
    console.log(`Socket.IO server listening on port 5001`);
});