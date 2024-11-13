import { Router } from "express";
import { addCategory, deleteCategory, getCategories, getCategory, updateCategory } from "./category.controller.js";
import { uploadSingleFile } from "../../fileUpload/FileUpload.js";
import { validate } from "../../middleWare/validate.js";
import { addCategoryVal } from "./category.validate.js";




const categoryRouter = Router()


categoryRouter
    .route("/")
    .post(uploadSingleFile('image', 'categories'), validate(addCategoryVal), addCategory)
    .get(getCategories)

categoryRouter
    .route("/:id")
    .get(getCategory)
    .put(uploadSingleFile('image', 'categories'), updateCategory)
    .delete(deleteCategory)

export default categoryRouter