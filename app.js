const express=require('express');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const Listing=require("./MODELS/listing.js")


main().then((res)=>{
    console.log("connected to db");   
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/NestAway');
}


app.listen(8080,()=>{
    console.log("server start");
    
})

app.get("/",(req,res)=>{
    res.send("root page");
})

//listings
app.get("/testlisting",async (req,res)=>{
    let sampleListing=new Listing({
        title:"My new Villa",
        description:"By the beach",
        price:1200,
        location:"Goa",
        country:"india",
    });

 await   sampleListing.save().then((res)=>{
    console.log(res);
    
 })
 console.log("saved");
 res.send("successfull testing");
 
});