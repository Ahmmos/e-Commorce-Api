
import { errorCatch } from "../../middleWare/errorCatch.js";
import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { Product } from "../../../database/models/products.model.js";
import { ProductRmAndUpdate, rmProductImgs } from "../../fileUpload/removeAndUpload.js";


// add new product
const addProduct = errorCatch(async (req, res, next) => {
    console.log(req.body)
    req.body.slug = slugify(req.body.title, '-')
    req.body.imgCover = req.files.imgCover[0].filename
    req.body.images = req.files.images.map(img => img.filename)
    const product = await Product.insertMany(req.body)
    res.status(200).send({ message: "added successfully", product })
})

// get all Products
const getProducts = errorCatch(async (req, res, next) => {
    const products = await Product.find()
    res.status(200).send({ message: "success", products })
})

// get product by id
const getProduct = errorCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    product || next(new AppError("categoty not found"), 404)
    !product || res.status(200).send({ message: "success", product })
})

// update product by id
const updateProduct = errorCatch(async (req, res, next) => {
    if (req.body.title) req.body.slug = slugify(req.body.title, '-')
    if (req.files.imgCover) req.body.imgCover = await ProductRmAndUpdate(req, Product)
    if (req.files.images) req.body.images = await ProductRmAndUpdate(req, Product)

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    product || next(new AppError("categoty not found"), 404)
    !product || res.status(200).send({ message: "updated successfully", product })
})

// delete product by id
const deleteProduct = errorCatch(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    product || next(new AppError("categoty not found"), 404)
    !product || res.status(200).send({ message: "deleted successfully", product })

    // remove images and cover image after delete the product
    let { imgCover, images } = product
    await rmProductImgs(imgCover, images)


})



export {
    addProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct
}