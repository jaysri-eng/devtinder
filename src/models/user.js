const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        lowercase: true,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email sent"+value);
            }
        }

    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Invalid password"+value);
            }
        }
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female"].includes(value)) //or !['male','female'].includes(value)
            {
                throw new Error("Gender not valid"+value);
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/previews/045/944/199/non_2x/male-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration-vector.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid url"+value);
            }
        }
    },
    about:{
        type:String,
        default:"this is about of the user",
    },
    skills:{
        type:[String],
        required:true,
        validate:{
            validator:function(value){
                return value.length<=5;
            },
            message:props=>`You can add up to 5 skills only. You provided ${props.value.length}.`
        }
    }
},{
    timestamps: true,
}
);

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = jwt.sign({_id:user._id},"Dev@tinder#2025",{expiresIn:"1d"});
    return token;
}

module.exports = mongoose.model("User",userSchema);

