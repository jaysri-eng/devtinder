const validator = require("validator");
const ConnectionRequest = require("../models/connectionRequest");

const validateSignupData = (req,res) => {
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("name isnt found");
    } else if(firstName.length<4 || firstName.length>=50){
        throw new Error("firstname too big");
    } else if(!validator.isEmail){
        throw new Error("email is not correct");
    } else if(!validator.isStrongPassword){
        throw new Error("password is not strong");
    }
}

const validateEditProfileData = (req,res)=>{
    const allowedEditFields = ["firstName","lastName","photoUrl","about","skills","gender","age"];
    const isAllowed = Object.keys(req.body).every(field=>allowedEditFields.includes(field));
    return isAllowed;
}

const validateSendRequestData = (req,res)=>{
    const allowedEditFields = ["ignored","interested"];
    const isAllowed = allowedEditFields.includes(req);
    return isAllowed;
}

const checkExistingConnectionRequests = async (fromUserId,toUserId) => {
    const request = await ConnectionRequest.findOne({
        $or:[
            {fromUserId, toUserId},
            {fromUserId:toUserId,toUserId:fromUserId},
        ]
    });
    return request;
}

const checkToUserId = async (toUserId) => {
    const toUser = await User.findById(toUserId);
    return toUser;
}

module.exports = {
    validateSignupData,
    validateEditProfileData,
    validateSendRequestData,
    checkExistingConnectionRequests,
    checkToUserId,
};