import { Router } from "express";
import { addSubCategory, getSubCategories, getSubcategory, updateSubcategory, deleteSubcategory } from "./subCategory.controller.js";
import { addSubCategoryVal } from "./subCategory.validate.js";
import { validate } from "../../middleWare/validate.js";




const subCategoryRouter = Router()


subCategoryRouter
    .route("/")
    .post(validate(addSubCategoryVal), addSubCategory)
    .get(getSubCategories)

subCategoryRouter
    .route("/:id")
    .get(getSubcategory)
    .put(updateSubcategory)
    .delete(deleteSubcategory)

export default subCategoryRouter