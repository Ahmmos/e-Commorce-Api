import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addToWishlist, getLoggedUserWishlist, removeFromWishlist } from "./wishlist.controller.js";
import { validate } from "../../middleWare/validate.js";
import { addWishlistVal } from "./wishlist.validate.js";




const wishlistRouter = Router()


wishlistRouter
    .route("/")
    .get(protectedRoutes, allowedTo('user'), getLoggedUserWishlist)
    .patch(protectedRoutes, allowedTo('user'), validate(addWishlistVal), addToWishlist)
wishlistRouter
    .route("/:id")
    .delete(protectedRoutes, allowedTo('user'), removeFromWishlist)

export default wishlistRouter