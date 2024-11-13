import { Category } from "../../../database/models/category.model.js";
import { errorCatch } from "../../middleWare/errorCatch.js";
import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { removeAndUpload } from "../../fileUpload/removeAndUpload.js";
import fs from 'fs'
import path from "path";


// add new category
const addCategory = errorCatch(async (req, res, next) => {
    req.body.slug = slugify(req.body.name, '-')
    req.body.image = req.file.filename
    // const category = await Category.insertMany(req.body)
    // res.status(200).send({ message: "added successfully", category })
    let category = await Category(req.body)
    await category.save()
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

    // to update slug if the name is changed 
    if (req.body.name) req.body.slug = slugify(req.body.name, '-')
    // to update image if the image is changed
    if (req.file) {
        let { image } = await Category.findById(req.params.id)
        req.body.image = removeAndUpload(image, req)
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    category || next(new AppError("categoty not found"), 404)
    !category || res.status(200).send({ message: "updated successfully", category })
})

// delete category by id
const deleteCategory = errorCatch(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id)
    category || next(new AppError("categoty not found"), 404)
    !category || res.status(200).send({ message: "deleted successfully", category })

    // delete image from folder
    if (category.image) {
        let imgPath = (path.resolve() + category.image.split("3000")[1]).replace(/\\/g, '/')
        fs.rmSync(imgPath)
    }

})



export {
    addCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}