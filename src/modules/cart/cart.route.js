import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {
    addToCart,
    clearUserCart,
    getLoggedUserCart,
    removeItemFromCart,
    updateQuantity
} from "./cart.controller.js";




const cartRouter = Router()


cartRouter
    .route("/")
    .post(protectedRoutes, allowedTo('user'), addToCart)
    .get(protectedRoutes, allowedTo('user'), getLoggedUserCart)
    .delete(protectedRoutes, allowedTo('user'), clearUserCart)
cartRouter
    .route("/:id")
    .put(protectedRoutes, allowedTo('user'), updateQuantity)
    .delete(protectedRoutes, allowedTo('user'), removeItemFromCart)

export default cartRouter