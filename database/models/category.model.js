import { Schema, model } from "mongoose";



const schema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"], // make name unique and "name is required" is custom error message 
        unique: true,
        trim: true,
        minLength: [3, "category name is too short"]
    },
    slug: {
        type: String,
        required: true,
        lowerCase: true
    },
    image: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true, versionKey: false })


schema.post('init', (doc) => {
    if (doc.image) doc.image = "http://localhost:3000/uploads/categories/" + doc.image
})


export const Category = model("Category", schema)