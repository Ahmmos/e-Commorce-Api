import { Schema, model } from "mongoose";


//  If you set timestamps: true, Mongoose will add two properties of type Date to your schema:
// createdAt: a date representing when this document was created
// updatedAt: a date representing when this document was last updated

// versionKey Set to false ==> to hide __V which create automatically in database 
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
        unique: true,
        lowerCase: true
    },
    image: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true, versionKey: false })

// to add address to the image uploaded and show full address on databas
schema.post('init', (doc) => {
    if (doc.image) doc.image = process.env.BASE_URL + "categories/" + doc.image
})


export const Category = model("Category", schema)