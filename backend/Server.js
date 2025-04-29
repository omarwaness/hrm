require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const http = require('http');
const path = require('path');
const { router: messageRouter, initSocket } = require('./Routes/messagesRoutes');

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// CORS configuration
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};
app.use(cors(corsOptions));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Session configuration
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    }),
}));

// Passport configuration
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", require("./Routes/authRoutes"));
app.use("/api/message", messageRouter);
app.use("/api/leave", require("./Routes/leaveRoutes"));
app.use("/api/user", require("./Routes/userRoutes"));
app.use("/api/reports", require("./Routes/reportRoutes"));
app.use("/api/resignation", require("./Routes/ResignationRoutes"));
app.use("/api/ai", require("./Routes/chatRoutes"));
app.use("/api/jobs", require("./Routes/jobRoutes"))
app.use("/api/applications", require("./Routes/applicationRoutes"))
app.use("/api/email", require("./Routes/emailRoutes"))
app.use("/api/ToDo",require('./Routes/toDoRoutes'))
app.use('/uploads/cvs', express.static(path.join(__dirname, 'uploads', 'cvs')));

// Make io available in routes/controllers
app.set("io", io);

// Start the REST API server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`REST API server listening on port ${PORT}`));

// Start the Socket.IO server
server.listen(5001, "0.0.0.0", () => {
    console.log(`Socket.IO server listening on port 5001`);
});

