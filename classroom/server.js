const express=require("express");
const app=express();

app.listen(3000,()=>{
    console.log("server start");
    
})

app.get("/",(req,res)=>{
    res.send("hii");
})

app.get("/user",(req,res)=>{
    res.send("user");
})

app.get("/user/:id",(req,res)=>{
    res.send("user");
})