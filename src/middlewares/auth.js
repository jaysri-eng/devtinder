const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next)=>{
    try{
        const cookies = req.cookies;
        const {token} = cookies;
        if(!token){
            throw new Error("Invalid token or it isnt available");
        }
        const decodedMsg = jwt.verify(token,"Dev@tinder#2025")
        const {_id} = decodedMsg;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("user does not exist");
        }
        req.user = user;
        next();
    } catch {
        res.status(400).send("there was an error");
    }
}

module.exports = {
    userAuth
}