import { Router } from "express";
import {
    addBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand
} from "./brand.controller.js";
import { uploadSingleFile } from "../../fileUpload/FileUpload.js";
import { addBrandVal, updateBrandVal } from "./brand.validate.js";
import { validate } from "../../middleWare/validate.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import productRouter from "../product/products.route.js";




const brandRouter = Router()

brandRouter.use('/:brand/products', productRouter)
brandRouter
    .route("/")
    .post(protectedRoutes, allowedTo('admin'), uploadSingleFile('logo'), validate(addBrandVal), addBrand)
    .get(getBrands)

brandRouter
    .route("/:id")
    .get(getBrand)
    .put(protectedRoutes, allowedTo('admin'), uploadSingleFile('logo', 'brands'), validate(updateBrandVal), updateBrand)
    .delete(protectedRoutes, allowedTo('admin'), deleteBrand)

export default brandRouter