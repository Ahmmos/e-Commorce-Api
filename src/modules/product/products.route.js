import { Router } from "express";
import {
    addProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct
} from "./product.controller.js";
import { uploadMixOfFiles } from "../../fileUpload/FileUpload.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { validate } from "../../middleWare/validate.js";
import { addProductVal } from "./product.validate.js";




const productRouter = Router()


productRouter
    .route("/")
    .post(protectedRoutes, allowedTo('admin'), uploadMixOfFiles([{ name: 'imgCover', maxCount: 1 }, { name: 'images', maxCount: 10 }], "products"),validate(addProductVal), addProduct)
    .get(getProducts)

productRouter
    .route("/:id")
    .get(getProduct)
    .put(protectedRoutes, allowedTo('admin'), uploadMixOfFiles([{ name: 'imgCover', maxCount: 1 }, { name: 'images', maxCount: 10 }], "products"), updateProduct)
    .delete(protectedRoutes, allowedTo('admin'), deleteProduct)
export default productRouter