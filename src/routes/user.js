const express = require("express");
const {userAuth} = require("../middlewares/auth")
const User = require('../models/user');
const ConnectionRequest = require("../models/connectionRequest");

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
        const page = parseInt(req.params.page)||1;
        const limit = parseInt(req.params.limit)||10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1)*limit;
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}
            ],
        }).select("fromUserId toUserId").populate("fromUserId","firstName").populate("toUserId","firstName");
        const hideUsersFromFeed = new set();
        connectionRequests.forEach(req=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        const users = await User.find({
            $and: [{_id:{$nin:Array.from(hideUsersFromFeed)}},{_id:{$ne:loggedInUser._id}}]
        }).select("firstName lastName about age gender skills photoUrl").skip(skip).limit(limit);
        res.send(users);
    } catch {
        res.send("something wrong")
    }
})
userRouter.get('/user/requests/received',userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested",
        }).populate("fromUserId",['firstName','lastName']); //or like this "firstName lastName"
        res.json({
            message:"Connection requests received",
            data:connectionRequests,
        })
    } catch {
        throw new Error("there was an error in fetching the requests");
    }
});
userRouter.get('/user/connections',userAuth,async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"},
            ]
        })
        .populate("fromUserId","firstName lastName about age gender skills")
        .populate("toUserId","firstName lastName about age gender skills");

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
            // if(row.fromUserId._id.equals(loggedInUser._id)){
            //     return row.toUserId;
            // }
            return row.fromUserId;
        });
        res.json({data})
    } catch {

    }
})
module.exports = userRouter;