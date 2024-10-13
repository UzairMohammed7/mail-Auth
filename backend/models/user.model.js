import mongoose from "mongoose";

// createat and updateat fields will be automatically added into the document
const userSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Enter a valid email id'] 
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name:{
        type: String,
        required: true
    },
    lastLogin:{
        type: Date,
        default: Date.now
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetTokenExpiration: Date,
    verificationToken: String,
    verificationTokenExpiration: Date,
},{timestamps: true});

export const User = mongoose.model('User',userSchema); 