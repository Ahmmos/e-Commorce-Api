
import { errorCatch } from "../../middleWare/errorCatch.js";
import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { Brand } from "../../../database/models/brand.model copy.js";


// add new category
const addBrand = errorCatch(async (req, res, next) => {
    req.body.slug = slugify(req.body.name, '-')
    const brand = await Brand.insertMany(req.body)
    res.status(200).send({ message: "added successfully", brand })
})

// get all categories
const getBrands = errorCatch(async (req, res, next) => {
    const brands = await Brand.find()
    res.status(200).send({ message: "success", brands })
})

// get brand by id
const getBrand = errorCatch(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id)
    // instead of if condition to check if brand we use it coz its faster
    brand || next(new AppError("categoty not found"), 404)
    !brand || res.status(200).send({ message: "success", brand })
})

// update brand by id
const updateBrand = errorCatch(async (req, res, next) => {
    req.body.slug = slugify(req.body.name, '-')
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true })
    brand || next(new AppError("categoty not found"), 404)
    !brand || res.status(200).send({ message: "updated successfully", brand })
})

// delete brand by id
const deleteBrand = errorCatch(async (req, res, next) => {
    const brand = await Brand.findByIdAndDelete(req.params.id)
    brand || next(new AppError("categoty not found"), 404)
    !brand || res.status(200).send({ message: "deleted successfully", brand })
})



export {
    addBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand
}