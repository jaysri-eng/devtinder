const express = require("express");
const app = express();
const adminAuth = require("./middlewares/auth")
const connectDb = require('./config/database')
const User = require('./models/user')

app.use(express.json()); //with this you can get the request's body in the json format, also a middleware

// app routes
app.get('/user',async (req,res)=>{
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
app.get('/feed',async (req,res)=>{
    try {
        const users = await User.find({});
        res.send(users);
    } catch {
        res.send("something wrong")
    }
})
app.post('/signup',async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save(); //this returns a promise so use async, await
        res.send("user created");
    } catch {
        res.status(400).send("there was an error in adding the user");
    }
})


connectDb()
.then(()=>{
    console.log("database connected");
    app.listen(3000,()=>{
        console.log("app has started");
    });
}).catch((err)=>{
    console.error("cant connect");
});