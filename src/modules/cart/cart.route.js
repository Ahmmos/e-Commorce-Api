import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {
    addToCart,
    applyCoupon,
    clearUserCart,
    getLoggedUserCart,
    removeCoupon,
    removeItemFromCart,
    updateQuantity
} from "./cart.controller.js";
import { validate } from "../../middleWare/validate.js";
import { addToCartVal, applyCouponVal, updateQuantityVal } from "./cart.validate.js";




const cartRouter = Router()

cartRouter
    .route("/")
    .post(protectedRoutes, allowedTo('user'), validate(addToCartVal), addToCart)
    .get(protectedRoutes, allowedTo('user'), getLoggedUserCart)
    .delete(protectedRoutes, allowedTo('user'), clearUserCart)
cartRouter
    .route("/:id")
    .put(protectedRoutes, allowedTo('user'), validate(updateQuantityVal), updateQuantity)
    .delete(protectedRoutes, allowedTo('user'), removeItemFromCart)
cartRouter
    .route("/apply-coupon")
    .post(protectedRoutes, allowedTo('user'), validate(applyCouponVal), applyCoupon)
cartRouter
    .route("/remove-coupon")
    .post(protectedRoutes, allowedTo('user'), removeCoupon)

export default cartRouter