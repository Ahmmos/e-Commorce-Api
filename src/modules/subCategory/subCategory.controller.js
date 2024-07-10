
import { errorCatch } from "../../middleWare/errorCatch.js";
import { AppError } from "../../utils/appError.js";
import { Subcategory } from "../../../database/models/subcategory.model.js";
import slugify from "slugify";



// add new category
const addSubCategory = errorCatch(async (req, res, next) => {
    req.body.slug = slugify(req.body.name, '-')
    const subCategory = await Subcategory.insertMany(req.body)
    res.status(200).send({ message: "added successfully", subCategory })
})

// get all categories
const getSubCategories = errorCatch(async (req, res, next) => {
    const subCategories = await Subcategory.find()
    res.status(200).send({ message: "success", subCategories })
})

// get Subcategory by id
const getSubcategory = errorCatch(async (req, res, next) => {
    const subCategory = await Subcategory.findById(req.params.id)
    // instead of if condition to check if Subcategory we use it coz its faster
    subCategory || next(new AppError("categoty not found"), 404)
    !subCategory || res.status(200).send({ message: "success", subCategory })
})

// update Subcategory by id
const updateSubcategory = errorCatch(async (req, res, next) => {
    req.body.slug = slugify(req.body.name, '-')
    const subCategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true })
    subCategory || next(new AppError("categoty not found"), 404)
    !subCategory || res.status(200).send({ message: "updated successfully", subCategory })
})

// delete Subcategory by id
const deleteSubcategory = errorCatch(async (req, res, next) => {
    const subCategory = await Subcategory.findByIdAndDelete(req.params.id)
    subCategory || next(new AppError("categoty not found"), 404)
    !subCategory || res.status(200).send({ message: "deleted successfully", subCategory })
})



export {
    addSubCategory,
    getSubCategories,
    getSubcategory,
    updateSubcategory,
    deleteSubcategory
}