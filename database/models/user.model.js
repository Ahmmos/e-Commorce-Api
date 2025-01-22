import { Schema, model } from "mongoose";
import bcrypt from "bcrypt"

//  If you set timestamps: true, Mongoose will add two properties of type Date to your schema:
// createdAt: a date representing when this document was created
// updatedAt: a date representing when this document was last updated

// versionKey Set to false ==> to hide __V which create automatically in database 

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  isBloked: {
    type: Boolean,
    default: false
  },
  confirmEmail: {
    type: Boolean,
    default: false
  },
  passwordChangedAt: Date,
  wishlist: [{
    type: Schema.Types.ObjectId,
    ref: "Product"
  }],
  addresses: [{
    city: String,
    street: String,
    phone: String
  }]
}, { timestamps: true, versionKey: false })



schema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, parseInt(process.env.SALT_ROUNDES))
})

schema.pre('findOneAndUpdate', function () {
  if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password, parseInt(process.env.SALT_ROUNDES))
})


export const User = model("User", schema)