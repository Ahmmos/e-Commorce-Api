import { Router } from "express";
import { addCategory, deleteCategory, getCategories, getCategory, updateCategory } from "./category.controller.js";




const categoryRouter = Router()


categoryRouter
    .route("/")
    .post(addCategory)
    .get(getCategories)

categoryRouter
    .route("/:id")
    .get(getCategory)
    .put(updateCategory)
    .delete(deleteCategory)

export default categoryRouter