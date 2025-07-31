const express = require("express");
const {userAuth} = require("../middlewares/auth")
const User = require('../models/user');

const userRouter = express.Router();

userRouter.get('/user',async (req,res)=>{
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
userRouter.patch('/user/:userId',async (req,res) => {
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
userRouter.get('/feed',async (req,res)=>{
    try {
        const users = await User.find({});
        res.send(users);
    } catch {
        res.send("something wrong")
    }
})

module.exports = userRouter;