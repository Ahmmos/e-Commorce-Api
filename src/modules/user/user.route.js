import { Router } from "express";
import {
    addUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
} from "./user.controller.js";

// import { validate } from "../../middleWare/validate.js";
import { checkEmail } from "../../middleWare/checkEmail.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";




const userRouter = Router()


userRouter
    .route("/")
    .post(protectedRoutes, allowedTo('admin'), checkEmail, addUser)
    .get(protectedRoutes, allowedTo('admin'), getUsers)

userRouter
    .route("/:id")
    .get(protectedRoutes, allowedTo('admin'), getUser)
    .put(protectedRoutes, allowedTo('admin'), updateUser)
    .delete(protectedRoutes, allowedTo('admin'), deleteUser)

export default userRouter