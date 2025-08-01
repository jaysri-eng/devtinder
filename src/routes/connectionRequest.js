const express = require("express");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { validateSendRequestData, checkExistingConnectionRequests, checkToUserId} = require("../utils/validation");
const User = require("../models/user");

const connectionRequestRouter = express.Router();

connectionRequestRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        if(!validateSendRequestData(req.params.status)){
            return res.status(400).send("Invalid status");
        }
        const existingRequest = await checkExistingConnectionRequests(req.user._id,req.params.toUserId);
        if(existingRequest){
            return res.status(400).send("Connection request already exists");
        }
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message:"the user id is not found"});
        }
        // const checkToUser = await checkToUserId(toUserId);
        // if(!checkToUser){
        //     return res.status(400).json({message:"the user id is not found"});
        // }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();
        res.json({
            message:req.user.firstName+"is"+status+"in"+toUser.firstName,
            data,
        })
    } catch {
        res.status(400).send("Could not send the request");
    }
});

connectionRequestRouter.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const {status,requestId} = req.params;
        const allowedStatus = ['accepted','rejected'];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Status is not valid"
            });
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested",
        })
        if(!connectionRequest){
            return res.status(404).json({
                message:"Connection request is not found"
            })
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message:"Connection request "+status,data
        });
    } catch {
        res.status(400).send("Could not send the request");
    }
});

module.exports = connectionRequestRouter;