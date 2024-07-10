import { Router } from "express";
import {
    addBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand
} from "./brand.controller.js";




const brandRouter = Router()


brandRouter
    .route("/")
    .post(addBrand)
    .get(getBrands)

brandRouter
    .route("/:id")
    .get(getBrand)
    .put(updateBrand)
    .delete(deleteBrand)

export default brandRouter