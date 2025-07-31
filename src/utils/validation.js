const validator = require("validator");

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
module.exports = validateSignupData;