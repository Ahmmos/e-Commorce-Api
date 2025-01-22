import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addAddress, getLoggedUserAddresses, removeAddress } from "./address.controller.js";




const addressRouter = Router()


addressRouter
    .route("/")
    .get(protectedRoutes, allowedTo('user', 'admin'), getLoggedUserAddresses)
    .patch(protectedRoutes, allowedTo('user'), addAddress)
addressRouter
    .route("/:id")
    .delete(protectedRoutes, allowedTo('user', 'admin'), removeAddress)

export default addressRouter