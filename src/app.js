const express = require("express");
const app = express();
const {userAuth} = require("./middlewares/auth")
const connectDb = require('./config/database')
const User = require('./models/user');
const validateSignupData = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json()); //with this you can get the request's body in the json format, also a middleware
app.use(cookieParser()); //with this package you can read or get the cookie stored in a session, also a middleware created by the express team 

// app routes
app.get('/user',async (req,res)=>{
    const userEmail = req.body.emailId;
    try {
        const users = await User.find({emailId:userEmail});
        if (users.length===0){
            res.status(400).send("not found");
        } else {
            res.send(users);
        }
    } catch {
        res.send("something wrong")
    }
})
app.patch('/user/:userId',async (req,res) => {
    const userId = req.params.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ['photoUrl','age','gender','about','skills'];
        const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("this change is not allowed");
        } 
        if(data?.skills.length>5){
            throw new Error("only 5 skills allowed")
        }
        const user = await User.findOneAndUpdate({_id:userId},data,{
            returnDocument: "after",
            runValidators:true,
        });
        console.log(user);
        res.send("update successful");
    } catch(err) {
        res.status(400).send("update failed"+err.message);
    }
})
app.get('/feed',async (req,res)=>{
    try {
        const users = await User.find({});
        res.send(users);
    } catch {
        res.send("something wrong")
    }
})
app.post('/login',async (req,res)=>{
    const {emailId, password} = req.body;
    const user = await User.findOne({emailId:emailId});
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(isPasswordValid){
        const token = await user.getJWT();
        // const token = jwt.sign({_id:user._id},"Dev@tinder#2025",{expiresIn:"1d"});
        res.cookie("token",token);

        res.send("login successful");
    } else {
        res.send("not successful");
    }
})
app.post('/signup',async (req,res)=>{
    // validateSignupData();
    const {firstName, lastName, emailId, password}=req.body;
    const passwordHash = await bcrypt.hash(password,10);
    const user = new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash,
    });
    try{
        await user.save(); //this returns a promise so use async, await
        res.send("user created");
    } catch (err) {
        console.log(req.body);
        console.log(err);
        res.status(400).send("there was an error in adding the user");
    }
})
app.get('/profile',userAuth,async (req,res)=>{
    const user = req.user;
    const {firstName, lastName} = user;
    if(!user){
        throw new Error("user does not exist");
    }
    res.send(firstName);
})

app.post('/sendConnectionRequest',userAuth,async(req,res)=>{
    const user = req.user;
    res.send(user.firstName+" sent you a connection request");
})

connectDb()
.then(()=>{
    console.log("database connected");
    app.listen(3000,()=>{
        console.log("app has started");
    });
}).catch((err)=>{
    console.error("cant connect");
});