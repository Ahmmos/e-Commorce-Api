import { Schema, model } from "mongoose";



const schema = new Schema({
    code: {
        type: String,
        unique: true, // make name unique and "name is required" is custom error message 
        required: true,
    },
    expires: Date,
    discount: Number
}, { timestamps: true, versionKey: false })


export const Coupon = model("Coupon", schema)