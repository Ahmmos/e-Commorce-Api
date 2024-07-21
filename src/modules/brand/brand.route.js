import { Router } from "express";
import {
    addBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand
} from "./brand.controller.js";
import { uploadSingleFile } from "../../fileUpload/FileUpload.js";




const brandRouter = Router()


brandRouter
    .route("/")
    .post(uploadSingleFile('logo', 'brands'), addBrand)
    .get(getBrands)

brandRouter
    .route("/:id")
    .get(getBrand)
    .put(uploadSingleFile('logo', 'brands'), updateBrand)
    .delete(deleteBrand)

export default brandRouter