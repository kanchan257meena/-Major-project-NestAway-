const mongoose=require('mongoose');
const { type } = require('os');

const Schema=mongoose.Schema;

const listingSchema =new Schema({
    title:{
       type:String,
       required:true,
    },
    description:{
        type:String,
    },
    image: {
  filename: {
    type: String,
    default: "listingimage"
  },
  url: {
    type: String,
    default: "https://images.unsplash.com/photo-1625505826533-...",
    set: (v) => v === "" 
        ? "https://images.unsplash.com/photo-1625505826533-..."
        : v,
  }
      },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    }

});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;