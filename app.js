
const express=require('express');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const Listing=require("./MODELS/listing.js");
const methodOverride=require('method-override');
const ejsMate=require("ejs-mate");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

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



//Index route
app.get("/listings",async (req,res)=>{
   try {
    const allListings = await Listing.find();  // get array of docs
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error(err);
    res.send("Error fetching listings");
  }
});

//Create : NEW & CREATE route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})
app.post("/listings", async(req,res)=>{
//   let {title ,description,image,price,country,location}=req.body;  
let newListing=new Listing(req.body.listing);
await newListing.save();
res.redirect("/listings")
// console.log(listing);

})


//show route  {return all the data , after we click on link this page will open}
app.get("/listings/:id",async (req,res)=>{
    
    try{
     let {id}=req.params;
   const listing=await  Listing.findById(id);
   res.render("listings/show.ejs",{listing});}
   catch(err){
    console.log(err);
   
   }
});


//Update : edit & update route
/*it will be done in two parts first get request to edit then post the edit part
*/ 
app.get("/listings/:id/edit",async (req,res)=>{
   
 try{
  let {id}=req.params;
   const listing=await  Listing.findById(id);
   res.render("listings/edit.ejs",{listing});}
   catch(err){
   console.log(err);  
   console.log("error");
   
   }
});

//can't update directly so we use a method override
app.put("/listings/:id",async (req,res)=>{ 
    let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
});


//DELETE 
app.delete("/listings/:id",async(req,res)=>{
    try{
    let {id}=req.params;
  let deletedlist= await Listing.findByIdAndDelete(id);
  console.log(deletedlist);
    res.redirect("/listings");
    }catch(err){
        console.log(err);
        
    }
})














//listings
// app.get("/testlisting",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Goa",
//         country:"india",
//     });

//  await   sampleListing.save().then((res)=>{
//     console.log(res);
    
//  })
//  console.log("saved");
//  res.send("successfull testing");
 
// });