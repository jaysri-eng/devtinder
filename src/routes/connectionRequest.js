const express = require("express");
const {userAuth} = require("../middlewares/auth")

const connectionRequestRouter = express.Router();

connectionRequestRouter.post('/sendConnectionRequest',userAuth,async(req,res)=>{
    const user = req.user;
    res.send(user.firstName+" sent you a connection request");
});

module.exports = connectionRequestRouter;