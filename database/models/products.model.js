import { Schema, model } from "mongoose";



const schema = new Schema({
    title: {
        type: String,
        unique: [true, "name is required"], // make name unique and "name is required" is custom error message 
        required: true,
        trim: true,
        minLength: [3, "brand name is too short"]
    },
    slug: {
        type: String,
        required: true,
        lowerCase: true
    },
    description: {
        type: String,
        required: true,
        minLength: 30,
        maxLength:1000
    },
    price: {
        type:Number,
        required:true,
        min:0
    },
    priceAfterDiscount: Number,
    imgCover: String,
    images: [String],
    rateAvg: {
        type: Number,
        min: 0,
        max: 5
    },
    rateCount: Number,
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: "Subcategory",
        required: true,
    },
    Brand: {
        type: Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },
    sold: Number,
    stock:{
        type:Number,
        min:0
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true, versionKey: false })


export const Product = model("Product", schema)