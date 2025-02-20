import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    title:{
        type : String,
        sparse: true,
    },
    subtitle:{
        type:String,
        sparse:true,
    },
    image:{

    }
})