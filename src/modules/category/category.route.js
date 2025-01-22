import { Router } from "express";
import { addCategory, deleteCategory, getCategories, getCategory, updateCategory } from "./category.controller.js";
import { uploadSingleFile } from "../../fileUpload/FileUpload.js";
import { validate } from "../../middleWare/validate.js";
import { addCategoryVal } from "./category.validate.js";
import subCategoryRouter from "../subCategory/subCategory.route.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";


const categoryRouter = Router()

categoryRouter.use('/:category/subCategories', subCategoryRouter)
categoryRouter
    .route("/")
    .post(protectedRoutes, allowedTo('admin'), uploadSingleFile('image', 'categories'), validate(addCategoryVal), addCategory)
    .get(getCategories)

categoryRouter
    .route("/:id")
    .get(getCategory)
    .put(protectedRoutes, allowedTo('admin'), uploadSingleFile('image', 'categories'), updateCategory)
    .delete(protectedRoutes, allowedTo('admin'), deleteCategory)

export default categoryRouter
