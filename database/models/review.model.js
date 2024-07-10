import { Schema, model } from "mongoose";



const schema = new Schema({
    comment: String,
    email: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    rate: {
        type: Number,
        min: 0,
        max: 5,
        required:true
    }
}, { timestamps: true, versionKey: false })


export const Review = model("Review", schema)