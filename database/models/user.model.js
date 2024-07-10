import { Schema, model } from "mongoose";



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
    type: boolean,
    default: false
  },
  confirmEmail: {
    type: string,
    default: false
  }
}, { timestamps: true, versionKey: false })


export const User = model("User", schema)