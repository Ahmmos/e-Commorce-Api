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
import orderRouter from "../orders/order.route.js";
import { validate } from "../../middleWare/validate.js";
import { addUserVal, upddateUserVal } from "./user.validate.js";
import reviewRouter from "../review/review.route.js";




const userRouter = Router()

userRouter.use('/:userId/orders', orderRouter)
userRouter.use('/:user/reviews', reviewRouter)

userRouter
    .route("/")
    .post(protectedRoutes, allowedTo('admin'), validate(addUserVal), checkEmail, addUser)
    .get(protectedRoutes, allowedTo('admin'), getUsers)


userRouter
    .route("/:id")
    .get(protectedRoutes, allowedTo('admin'), getUser)
    .put(protectedRoutes, allowedTo('admin'), validate(upddateUserVal), updateUser)
    .delete(protectedRoutes, allowedTo('admin'), deleteUser)



export default userRouter