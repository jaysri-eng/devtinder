const express = require("express");
const {userAuth} = require("../middlewares/auth")
const User = require("../models/user")
const {validateEditProfileData} = require("../utils/validation")

const profileRouter = express.Router();

profileRouter.get('/profile/view',userAuth,async (req,res)=>{
    const user = req.user;
    const {firstName, lastName} = user;
    if(!user){
        throw new Error("user does not exist");
    }
    res.send(firstName);
})

profileRouter.patch('/profile/edit',userAuth,async (req,res)=>{
    try {
        if(!validateEditProfileData(req)){
            return res.status(400).send("Cant edit the field");
        }
        const user = req.user;
        // Object.keys(req.body).forEach((key)=>(user[key]=req.body[key]));
        const {firstName, lastName, password, about} = user;
        if(!user){
            throw new Error("user does not exist");
        }
        await User.findOneAndUpdate({firstName:firstName},req.body);
        res.send("Profile edited successfully");
    } catch {
        return res.status(400).send("something wrong, profile not edited");
    }
})

profileRouter.patch('/profile/password',userAuth,async (req,res)=>{
    try {
        const user = req.user;
        const {emailId, password, _id} = user;
        if(!user){
            throw new Error("user does not exist");
        }
        await User.findByIdAndUpdate({password:password},req.body);
    } catch {
        res.status(400).send("Password wasnt updated");
    }
})

module.exports = profileRouter;