import mongoose from "mongoose";
import { type } from "os";

const bannerSchema = new mongoose.Schema({

    banners: {
        type: [{
            url: {
                type: String,
                require: true
            },
            index: {
                type: Number,
                unique:true,
                require: true
            },
            linktitle: {
                type: String,
            },
            link: {
                type: String,
            }
        }],
    }
})

export const Banner = mongoose.model('banners', bannerSchema)
