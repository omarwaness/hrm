require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // ✅ UPDATED import
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// CORS configuration
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Mongo Connected"))
.catch((err) => console.error(err));

// ✅ Updated session configuration
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions' 
    }),
}));

// Passport middleware
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", require("./Routes/authRoutes"));
app.use("/api/message", require("./Routes/messagesRoutes"));
app.use("/api/leave", require("./Routes/leaveRoutes"));
app.use("/api/user", require("./Routes/userRoutes"));
app.use("/api/reports", require("./Routes/reportRoutes"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on port ${PORT}`));
