import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { createCashOrder, createCheckoutSession, getAllOrders, getUserOrders } from "./order.controller.js";
import { validate } from "../../middleWare/validate.js";
import { createCashOrderVal, createCheckoutVal } from "./order.validate.js";




const orderRouter = Router({ mergeParams: true })

orderRouter
    .route("/")
    .get(protectedRoutes, allowedTo('admin'), getAllOrders)

orderRouter
    .route("/myOrders")
    .get(protectedRoutes, allowedTo('user'), getUserOrders)
orderRouter
    .route("/checkout/:id")
    .post(protectedRoutes, allowedTo('user'), validate(createCheckoutVal), createCheckoutSession)

orderRouter
    .route("/:id")
    .post(protectedRoutes, allowedTo('user'), validate(createCashOrderVal), createCashOrder)

export default orderRouter