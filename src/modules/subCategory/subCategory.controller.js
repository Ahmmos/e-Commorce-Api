
import { errorCatch } from "../../middleWare/errorCatch.js";
import { AppError } from "../../utils/appError.js";
import { Subcategory } from "../../../database/models/subcategory.model.js";
import slugify from "slugify";
import { Category } from "../../../database/models/category.model.js";
import { ApiFeature } from "../../utils/apiFeature.js";



// add new subcategory
const addSubCategory = errorCatch(async (req, res, next) => {
    const category = await Category.findById(req.body.category)
    if (category) {
        req.body.slug = slugify(req.body.name, '-')

        let subCategory = await Subcategory(req.body)
        await subCategory.save()

        res.status(200).send({ message: "added successfully", subCategory })
    } else {
        return next(new AppError("There is not category with this id", 404))
    }
})

// get all subategories
const getSubCategories = errorCatch(async (req, res, next) => {
    // mergeparams
    // categories/:category/subcategories

    let filterObj = {}
    if (req.params.category) filterObj.category = req.params.category



    let apiFeature = new ApiFeature(Subcategory.find(filterObj), req.query)
        .pagination(Subcategory).fields().sort().search().filter()

    let subcategories = await apiFeature.mongooseQuery
    let totalSubcategories = (await Subcategory.find(filterObj)).length

    res.status(200).send({
        message: "success", metadata: {
            total: totalSubcategories,
            currentPage: apiFeature.pageNumber,
            limit: apiFeature.limit,
            numberOfPages: Math.ceil(totalSubcategories / apiFeature.limit),
            nextPage: apiFeature.nextPage
        }, subcategories
    })
})

// get Subcategory by id
const getSubcategory = errorCatch(async (req, res, next) => {
    const subCategory = await Subcategory.findById(req.params.id)
    // instead of if condition to check if Subcategory we use it coz its faster
    subCategory || next(new AppError("Subcategoty not found"), 404)
    !subCategory || res.status(200).send({ message: "success", subCategory })
})

// update Subcategory by id
const updateSubcategory = errorCatch(async (req, res, next) => {
    req.body.slug = slugify(req.body.name, '-')
    const subCategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true })
    subCategory || next(new AppError("Subcategoty not found"), 404)
    !subCategory || res.status(200).send({ message: "updated successfully", subCategory })
})

// delete Subcategory by id
const deleteSubcategory = errorCatch(async (req, res, next) => {
    const subCategory = await Subcategory.findByIdAndDelete(req.params.id)
    subCategory || next(new AppError("Subcategoty not found"), 404)
    !subCategory || res.status(200).send({ message: "deleted successfully", subCategory })
})



export {
    addSubCategory,
    getSubCategories,
    getSubcategory,
    updateSubcategory,
    deleteSubcategory
}