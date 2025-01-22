
import { errorCatch } from "../../middleWare/errorCatch.js";
import { AppError } from "../../utils/appError.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { Coupon } from "../../../database/models/coupon.model.js";



// add new coupon
const addCoupon = errorCatch(async (req, res, next) => {
    const isExisit = await Coupon.findOne({ code: req.body.code })
    if (isExisit) return next(new AppError("Coupon is already exisit"), 409)

    const coupon = await Coupon(req.body)
    await coupon.save()
    res.status(200).send({ message: "added successfully", coupon })
})

// get all coupons
const getCoupons = errorCatch(async (req, res, next) => {

    let apiFeature = new ApiFeature(Coupon.find(), req.query)
        .pagination(Coupon).fields().sort().search().filter()

    let coupons = await apiFeature.mongooseQuery
    let totalcoupons = await apiFeature.total

    res.status(200).send({
        message: "success", metadata: {
            total: totalcoupons,
            currentPage: apiFeature.pageNumber,
            limit: apiFeature.limit,
            numberOfPages: Math.ceil(totalcoupons / apiFeature.limit),
            nextPage: apiFeature.nextPage
        }, coupons
    })
})

// get coupon by id
const getCoupon = errorCatch(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id)

    // instead of if condition to check if coupon we use it coz its faster
    coupon || next(new AppError("coupon not found"), 404)
    !coupon || res.status(200).send({ message: "success", coupon })
})

// update coupon by id
const updateCoupon = errorCatch(async (req, res, next) => {

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true })
    coupon || next(new AppError("coupon not found"), 404)
    !coupon || res.status(200).send({ message: "updated successfully", coupon })
})

// delete coupon by id
const deleteCoupon = errorCatch(async (req, res, next) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id)
    coupon || next(new AppError("coupon not found"), 404)
    !coupon || res.status(200).send({ message: "deleted successfully", coupon })
})



export {
    addCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon
}