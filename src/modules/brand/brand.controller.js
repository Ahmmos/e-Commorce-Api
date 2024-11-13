
import { errorCatch } from "../../middleWare/errorCatch.js";
import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { Brand } from "../../../database/models/brand.model.js";
import fs from "fs";
import path from "path";
import { removeAndUpload } from "../../fileUpload/removeAndUpload.js";


// add new brand
const addBrand = errorCatch(async (req, res, next) => {
    req.body.slug = slugify(req.body.name, '-')
    req.body.logo = req.file.filename
    const brand = await Brand.insertMany(req.body)
    res.status(200).send({ message: "added successfully", brand })
})

// get all brands
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
    if (req.body.name) req.body.slug = slugify(req.body.name, '-')
    if (req.file) {
        let { logo } = await Brand.findById(req.params.id)
        req.body.logo = removeAndUpload(logo, req)
    }
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true })
    brand || next(new AppError("categoty not found"), 404)
    !brand || res.status(200).send({ message: "updated successfully", brand })
})

// delete brand by id
const deleteBrand = errorCatch(async (req, res, next) => {
    const brand = await Brand.findByIdAndDelete(req.params.id)
    brand || next(new AppError("categoty not found"), 404)
    !brand || res.status(200).send({ message: "deleted successfully", brand })

    // delete logo
    if (brand.logo) {
        let imgPath= (path.resolve() + brand.logo.split("3000")[1]).replace(/\\/g, '/')
        fs.rmSync(imgPath)
     }
})



export {
    addBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand
}