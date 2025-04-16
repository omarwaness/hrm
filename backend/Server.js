require("dotenv").config();
const express=require("express");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const mongoose=require("mongoose");
const app=express();


app.use(express.json());
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongo Connected"))
.catch((err)=>console.error(err));

app.use("/api/auth",require("./Routes/authRoutes"))
app.use("/api/message", require("./Routes/messagesRoutes"))
app.use("/api/leave", require("./Routes/leaveRoutes"))
app.use("/api/user", require("./Routes/userRoutes"))
app.use("/api/reports", require("./Routes/reportRoutes"));



const PORT=process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0',()=>console.log(`Server listen on port ${PORT}`));
