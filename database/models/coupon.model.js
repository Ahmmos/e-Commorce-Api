import { Schema, model } from "mongoose";

//  If you set timestamps: true, Mongoose will add two properties of type Date to your schema:
// createdAt: a date representing when this document was created
// updatedAt: a date representing when this document was last updated

// versionKey Set to false ==> to hide __V which create automatically in database 

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