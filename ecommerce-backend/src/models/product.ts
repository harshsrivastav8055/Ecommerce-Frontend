import mongoose  from "mongoose";

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , "Please Enter name"],
    },
    photo:{
        type:String,
        required:[true , "Please Enter Photo"],
    },
    price:{
        type:Number,
        required:[true , "Please enter Price"],
    },
    stock:{
        type:Number,
        required:[true , "Please enter Price"],
    },
    category:{
        type:String,
        required:[true , "Please Enter Category"],
        trim:true,
    },
},
{
    timestamps:true,
});

export const Product = mongoose.model("Product" , schema)

