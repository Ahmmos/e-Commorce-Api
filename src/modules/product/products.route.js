import { Router } from "express";
import {  addProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct } from "./product.controller.js";
import { uploadMixOfFiles } from "../../fileUpload/FileUpload.js";




const productRouter = Router()


productRouter
    .route("/")
    .post(uploadMixOfFiles([{ name: 'imgCover', maxCount: 1 }, { name: 'images', maxCount: 10 }],"products"), addProduct)
    .get(getProducts)

productRouter
    .route("/:id")
    .get(getProduct)
    .put(uploadMixOfFiles([{ name: 'imgCover', maxCount: 1 }, { name: 'images', maxCount: 10 }],"products"),updateProduct)
    .delete(deleteProduct)
export default productRouter