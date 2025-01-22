import { Schema, model } from "mongoose";


//  If you set timestamps: true, Mongoose will add two properties of type Date to your schema:
// createdAt: a date representing when this document was created
// updatedAt: a date representing when this document was last updated

// versionKey Set to false ==> to hide __V which create automatically in database 

const schema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    cartItems: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number, default: 1
            },
            price: Number
        }
    ],
    totalCartPrice: Number,
    cartDiscount: Number,
    cartTotalAfterDiscount: Number

}, { timestamps: true, versionKey: false })

export const Cart = model("Cart", schema)
