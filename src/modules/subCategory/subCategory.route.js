import { Router } from "express";
import { addSubCategory, getSubCategories, getSubcategory, updateSubcategory, deleteSubcategory } from "./subCategory.controller.js";
import { addSubCategoryVal } from "./subCategory.validate.js";
import { validate } from "../../middleWare/validate.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";




const subCategoryRouter = Router({ mergeParams: true })


subCategoryRouter
    .route("/")
    .post(protectedRoutes, allowedTo('admin'), validate(addSubCategoryVal), addSubCategory)
    .get(getSubCategories)

subCategoryRouter
    .route("/:id")
    .get(getSubcategory)
    .put(protectedRoutes, allowedTo('admin'), updateSubcategory)
    .delete(protectedRoutes, allowedTo('admin'), deleteSubcategory)

export default subCategoryRouter