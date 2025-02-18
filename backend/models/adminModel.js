import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

export const adminModel = mongoose.model('admin', adminSchema, 'admins');
