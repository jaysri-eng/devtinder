const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    status: {
        type: String,
        enum: {
            values: ["ignore","accepted","interested","rejected"],
            message: `{VALUE} is an incorrect status type`
        },
        required:true,
    }
},{
    timestamps:true,
}
);

connectionRequestSchema.index({fromUserId:1, toUserId:1}); //compound index

//validation before saving, this will be helpful to prevent duplicate ids
connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You can not send the connection request to yourself");
    }
    next();
})

module.exports = mongoose.model("ConnectionRequest",connectionRequestSchema);

