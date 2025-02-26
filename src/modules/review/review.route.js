import { Router } from "express";
import {
    addReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview
} from "./review.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { validate } from "../../middleWare/validate.js";
import { addReviewVal, updateReviewVal } from "./review.validate.js";




const reviewRouter = Router({ mergeParams: true })


reviewRouter
    .route("/")
    .post(protectedRoutes, allowedTo('user'), validate(addReviewVal), addReview)
    .get(getReviews)

reviewRouter
    .route("/:id")
    .get(getReview)
    .put(protectedRoutes, allowedTo('user'), validate(updateReviewVal), updateReview)
    .delete(protectedRoutes, allowedTo('admin', 'user'), deleteReview)

export default reviewRouter