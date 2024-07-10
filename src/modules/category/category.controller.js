import { Category } from "../../../database/models/category.model.js";
import { errorCatch } from "../../middleWare/errorCatch.js";
import slugify from "slugify";
import { AppError } from "../../utils/appError.js";


// add new category
const addCategory = errorCatch(async (req, res, next) => {
    req.body.slug = slugify(req.body.name, '-')
    const category = await Category.insertMany(req.body)
    res.status(200).send({ message: "added successfully", category })
})

// get all categories
const getCategories = errorCatch(async (req, res, next) => {
    const categories = await Category.find()
    res.status(200).send({ message: "success", categories })
})

// get category by id
const getCategory = errorCatch(async (req, res, next) => {
    const category = await Category.findById(req.params.id)
    // instead of if condition to check if category we use it coz its faster
    category || next(new AppError("categoty not found"), 404)
    !category || res.status(200).send({ message: "success", category })
})

// update category by id
const updateCategory = errorCatch(async (req, res, next) => {
    req.body.slug = slugify(req.body.name, '-')
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    category || next(new AppError("categoty not found"), 404)
    !category || res.status(200).send({ message: "updated successfully", category })
})

// delete category by id
const deleteCategory = errorCatch(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id)
    category || next(new AppError("categoty not found"), 404)
    !category || res.status(200).send({ message: "deleted successfully", category })
})



export {
    addCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}