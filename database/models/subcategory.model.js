import { Schema, model } from "mongoose";



const schema = new Schema({
    name: {
        type: String,
        unique: [true, "name is required"], // make name unique and "name is required" is custom error message 
        required: true,
        trim: true,
        minLength: [3, "subcategory name is too short"]
    },
    slug: {
        type: String,
        unique:true,
        required: true,
        lowerCase: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true, versionKey: false })


export const Subcategory = model("Subcategory", schema)