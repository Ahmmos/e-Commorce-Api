import { Schema, model } from "mongoose";

//  If you set timestamps: true, Mongoose will add two properties of type Date to your schema:
// createdAt: a date representing when this document was created
// updatedAt: a date representing when this document was last updated

// versionKey Set to false ==> to hide __V which create automatically in database 

const schema = new Schema({
    title: {
        type: String,
        unique: [true, "title is already exist"], // make name unique and "name is required" is custom error message 
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

}, { timestamps: true, versionKey: false, toJSON: { virtuals: true }, id: false })


// create virtual element will not save in datbase and target of it to use for population

schema.virtual('ProductReviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product'
});


//  to populate the ProductReviews of each product
// but to work and appear you should make toJSON: { virtuals: true }  inside the schema

schema.pre("findOne", function () {
    this.populate("ProductReviews");
})



// to add address to the images uploaded and show full address on databas
schema.post('init', (doc) => {
    if (doc.imgCover) doc.imgCover = process.env.BASE_URL + "products/" + doc.imgCover

    if (doc.images) doc.images = doc.images.map(image => image = process.env.BASE_URL + "products/" + image)
})
export const Product = model("Product", schema)