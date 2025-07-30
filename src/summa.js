const express = require("express");
const app = express();
const adminAuth = require("./middlewares/auth")

// app.use('/admin',adminAuth);
// app.get("/admin/getAllData",adminAuth,(req,res)=>{
// });
// app.delete("/admin/deleteAllData",(req,res)=>{
// });

app.use("/admin/putData",(req,res)=>{
    try {
        // logic
        res.send("sent");
    } catch (err) {
        // throw new Error("error");
        res.status(501).send("error");
    }
})
// app.user("/user",r1,r2,[r3,r4],r5)
app.use("/user/:userId",(req,res)=>{
    console.log(req.params);
    res.send("Hello");
})

app.use("/hello/2",(req,res)=>{
    res.send("Hello");
})
app.use("/hello",
    (req,res,next)=>{
        res.send("Hello");
        next();
    },
    (req,res)=>{
        res.send("2nd hello")
    }
);
app.use("/",(req,res)=>{
    res.send("Hello");
})