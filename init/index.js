const mongoose=require('mongoose');
const initData=require("./data.js");
const Listing=require("../MODELS/listing.js");

main().then((res)=>{
    console.log("connected to db");   
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/NestAway');
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
      ...obj, owner:"6905a9dcb459adcf6aa88e51",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
    
}
initDB();
