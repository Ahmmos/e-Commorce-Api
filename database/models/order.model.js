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
    orderItems: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product" },
            quantity: Number,
            price: Number
        }
    ],
    totalOrderPrice: Number,
    shippingAddress: {
        street: String,
        city: String,
        phone: String
    },
    paymentType: {
        type: String,
        enum: ["card", "Cash"],
        default: "Cash"
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date

}, { timestamps: true, versionKey: false })

export const Order = model("Order", schema)
