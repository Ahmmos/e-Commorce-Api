import { Router } from "express";
import { allowedTo, changeUserPassword, confirmEmail, protectedRoutes, signIn, signUp } from "./auth.controller.js";
import { checkEmail } from "../../middleWare/checkEmail.js";
import { validate } from "../../middleWare/validate.js";
import { changePasswordVal, signUpVal, singInVal } from "./auth.validate.js";






const authRouter = Router();


authRouter
    .post("/signin", validate(singInVal), signIn)
    .post("/signup", validate(signUpVal), checkEmail, signUp)
    .patch("/change-password", protectedRoutes, allowedTo('user', 'admin'), validate(changePasswordVal), changeUserPassword)

authRouter
    .route("/verify-email/:token")
    .get(confirmEmail)

export default authRouter