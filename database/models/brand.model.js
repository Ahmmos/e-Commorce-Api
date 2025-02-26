import { Schema, model } from "mongoose";

//  If you set timestamps: true, Mongoose will add two properties of type Date to your schema:
// createdAt: a date representing when this document was created
// updatedAt: a date representing when this document was last updated

// versionKey Set to false ==> to hide __V which create automatically in database 

const schema = new Schema({
    name: {
        type: String,
        unique: [true, "name is unique"], // make name unique and "name is required" is custom error message 
        required: true,
        trim: true,
        minLength: [2, "brand name is too short"]
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        lowerCase: true
    },
    logo: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true, versionKey: false })


schema.post('init', (doc) => {
    if (doc.logo) doc.logo = process.env.BASE_URL+ "brands/" + doc.logo

})

export const Brand = model("Brand", schema)