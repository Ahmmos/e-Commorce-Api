import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {
    addCoupon,
    deleteCoupon,
    getCoupon,
    getCoupons,
    updateCoupon
} from "./coupon.controller.js";
import { validate } from "../../middleWare/validate.js";
import { addCouponVal, updateCouponVal } from "./coupon.validate.js";




const couponRouter = Router()

couponRouter.use(protectedRoutes, allowedTo('admin'))
couponRouter
    .route("/")
    .post(validate(addCouponVal), addCoupon)
    .get(getCoupons)

couponRouter
    .route("/:id")
    .get(getCoupon)
    .put(validate(updateCouponVal), updateCoupon)
    .delete(deleteCoupon)

export default couponRouter