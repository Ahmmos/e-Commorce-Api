import { Router } from "express";
import { allowedTo, changeUserPassword, protectedRoutes, signIn, signUp } from "./auth.controller.js";
import { checkEmail } from "../../middleWare/checkEmail.js";






const authRouter = Router();


authRouter
    .post("/signin", signIn)
    .post("/signup", checkEmail, signUp)
    .patch("/change-password", protectedRoutes, allowedTo('user', 'admin'),  changeUserPassword)


export default authRouter