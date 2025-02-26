
import { errorCatch } from "../../middleWare/errorCatch.js";
import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { Product } from "../../../database/models/products.model.js";
import { ProductRmAndUpdate, rmProductImgs } from "../../fileUpload/removeAndUpload.js";
import { ApiFeature } from "../../utils/apiFeature.js";


// add new product
const addProduct = errorCatch(async (req, res, next) => {
    req.body.slug = slugify(req.body.title, '-')
    req.body.imgCover = req.files.imgCover[0].filename
    req.body.images = req.files.images.map(img => img.filename)

    let product = await Product(req.body)
    await product.save()

    res.status(200).send({ message: "added successfully", product })
})

// get all Products
const getProducts = errorCatch(async (req, res, next) => {
    // mergeparams
    // for categories , subCategories and brands
    // dustructure the params to get the category , subCategory and brand

    const { category, subCategory, brand } = req.params;
    const filterObj = { category, subCategory, brand };
    // Remove undefined values from filterObj
    Object.keys(filterObj).forEach(key => filterObj[key] === undefined && delete filterObj[key]);

    let apiFeature = new ApiFeature(Product.find(filterObj), req.query)
        .pagination(Product).fields().sort().search().filter()

    let products = await apiFeature.mongooseQuery
    let totalproducts = (await Product.find(filterObj)).length

    res.status(200).send({
        message: "success", metadata: {
            total: totalproducts,
            currentPage: apiFeature.pageNumber,
            limit: apiFeature.limit,
            numberOfPages: Math.ceil(totalproducts / apiFeature.limit),
            nextPage: apiFeature.nextPage
        }, products
    })
})

// get product by id
const getProduct = errorCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id)


    // set the number of product reviews count and the rateAvg 

    product.rateCount = product.ProductReviews.length

    if (product.ProductReviews.length != 0) {
        let rateAvarege = product.ProductReviews.map(el => el.rate)
        product.rateAvg = rateAvarege.reduce((a, b) => a + b) / rateAvarege.length
    } else {
        product.rateAvg = 0
    }


    product || next(new AppError("Product not found"), 404)
    !product || res.status(200).send({ message: "success", product })
})

// update product by id
const updateProduct = errorCatch(async (req, res, next) => {
    // update any field through the request body and images through files 

    if (req.body.title) req.body.slug = slugify(req.body.title, '-')
    if (req.files) {
        await ProductRmAndUpdate(req, Product)
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    product || next(new AppError("Product not found"), 404)
    !product || res.status(200).send({ message: "updated successfully", product })
})

// delete product by id
const deleteProduct = errorCatch(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    product || next(new AppError("Product not found"), 404)
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