import { Schema, model } from "mongoose";

//  If you set timestamps: true, Mongoose will add two properties of type Date to your schema:
// createdAt: a date representing when this document was created
// updatedAt: a date representing when this document was last updated

// versionKey Set to false ==> to hide __V which create automatically in database 

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
        maxLength: 1000
    },
    price: {
        type: Number,
        required: true,
        min: 0
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
    brand: {
        type: Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },
    sold: Number,
    stock: {
        type: Number,
        min: 0
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true, versionKey: false })

// to add address to the images uploaded and show full address on databas

schema.post('init', (doc) => {
    if (doc.imgCover) doc.imgCover = "http://localhost:3000/uploads/products/" + doc.imgCover

    if (doc.images) doc.images = doc.images.map(image => image = "http://localhost:3000/uploads/products/" + image)
})
export const Product = model("Product", schema)