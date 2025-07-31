const express = require("express");
const app = express();
const connectDb = require('./config/database')
const cookieParser = require("cookie-parser");

app.use(express.json()); //with this you can get the request's body in the json format, also a middleware
app.use(cookieParser()); //with this package you can read or get the cookie stored in a session, also a middleware created by the express team 

// app routes
const authRouter = require("./routes/auth");
const connectionRequestRouter = require("./routes/connectionRequest");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',connectionRequestRouter);
app.use('/',userRouter);

connectDb()
.then(()=>{
    console.log("database connected");
    app.listen(3000,()=>{
        console.log("app has started");
    });
}).catch((err)=>{
    console.error("cant connect");
});