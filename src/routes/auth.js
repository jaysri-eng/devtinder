const express = require("express");
const validateSignupData = require("../utils/validation");
const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {userAuth} = require("../middlewares/auth")

const authRouter = express.Router();

// authRouter.get('/');
authRouter.post('/login',async (req,res)=>{
    const {emailId, password} = req.body;
    const user = await User.findOne({emailId:emailId});
    const isPasswordValid = await user.validatePassword(password);
    // const isPasswordValid = await bcrypt.compare(password,user.password);
    if(isPasswordValid){
        const token = await user.getJWT();
        // const token = jwt.sign({_id:user._id},"Dev@tinder#2025",{expiresIn:"1d"});
        res.cookie("token",token);

        res.send("login successful");
    } else {
        res.send("not successful");
    }
})
authRouter.post('/signup',async (req,res)=>{
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
authRouter.post('/logout',async (req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    });
    res.send("Logout successful");
})

module.exports = authRouter;