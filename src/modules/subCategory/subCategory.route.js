import { Router } from "express";
import { addSubCategory, getSubCategories, getSubcategory, updateSubcategory, deleteSubcategory } from "./subCategory.controller.js";




const subCategoryRouter = Router()


subCategoryRouter
    .route("/")
    .post(addSubCategory)
    .get(getSubCategories)

subCategoryRouter
    .route("/:id")
    .get(getSubcategory)
    .put(updateSubcategory)
    .delete(deleteSubcategory)

export default subCategoryRouter