
import { errorCatch } from "../../middleWare/errorCatch.js";
import { AppError } from "../../utils/appError.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { Review } from "../../../database/models/review.model.js";


// add new review
const addReview = errorCatch(async (req, res, next) => {
    // make the user add no more than one review for each product 
    req.body.user = req.user._id
    const isExist = await Review.findOne({ user: req.user._id, product: req.body.product })
    if (isExist) return next(new AppError("you can't add more then one review"))

    let review = await Review(req.body)
    await review.save()
    res.status(200).send({ message: "added successfully", review })
})

// get all reviews
const getReviews = errorCatch(async (req, res, next) => {

    let filterObj = {}
    if (req.params.product) filterObj.product = req.params.product

    let apiFeature = new ApiFeature(Review.find(filterObj), req.query)
        .pagination(Review).fields().sort().search().filter()

    let reviews = await apiFeature.mongooseQuery
    let totalReviews = (await Review.find(filterObj)).length

    res.status(200).send({
        message: "success", metadata: {
            total: totalReviews,
            currentPage: apiFeature.pageNumber,
            limit: apiFeature.limit,
            numberOfPages: Math.ceil(totalReviews / apiFeature.limit),
            nextPage: apiFeature.nextPage
        }, reviews
    })
})

// get review by id
const getReview = errorCatch(async (req, res, next) => {
    const review = await Review.findById(req.params.id)
    // instead of if condition to check if review we use it coz its faster
    review || next(new AppError("review not found"), 404)
    !review || res.status(200).send({ message: "success", review })
})

// update review by id
const updateReview = errorCatch(async (req, res, next) => {
    // make the user who won the review that he is the one only can edit the review

    const review = await Review.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true })
    review || next(new AppError("review not found or you are not authrized to edit this review"), 404)
    !review || res.status(200).send({ message: "updated successfully", review })
})

// delete review by id
const deleteReview = errorCatch(async (req, res, next) => {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    review || next(new AppError("review not found or you are not authrized to edit this review"), 404)
    !review || res.status(200).send({ message: "deleted successfully", review })
})



export {
    addReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview
}