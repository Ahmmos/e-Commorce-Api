
import Joi from "joi";


const addProductVal = Joi.object({
    title: Joi.string().min(1).max(50).required(),
    description: Joi.string().min(30).max(3000).required(),
    price: Joi.number().min(0).required(),
    priceAfterDiscount: Joi.number(),
    rateCount: Joi.number(),
    sold: Joi.number(),
    rateAvg: Joi.number().min(0).max(5),
    category: Joi.string().hex().length(24).required(),
    subCategory: Joi.string().hex().length(24).required(),
    brand: Joi.string().hex().length(24).required(),
    stock: Joi.number().min(0),
    createdBy: Joi.string().hex().length(24).required(),
    imgCover: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/jiff').required(),
        size: Joi.number().max(5242880).required(),
        buffer: Joi.any(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
    }).required(),
    images: Joi.array().items(
        Joi.object({
            fieldname: Joi.string().required(),
            originalname: Joi.string().required(),
            encoding: Joi.string().required(),
            mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/jiff').required(),
            size: Joi.number().max(5242880).required(),
            buffer: Joi.any(),
            destination: Joi.string().required(),
            filename: Joi.string().required(),
            path: Joi.string().required(),
        }).required()).required()
})

const updateProductVal = Joi.object({
    id: Joi.string().hex().length(24).required(),
    title: Joi.string().min(1).max(50),
    description: Joi.string().min(30).max(3000),
    price: Joi.number().min(0),
    priceAfterDiscount: Joi.number(),
    rateCount: Joi.number(),
    sold: Joi.number(),
    rateAvg: Joi.number().min(0).max(5),
    category: Joi.string().hex().length(24),
    subCategory: Joi.string().hex().length(24),
    brand: Joi.string().hex().length(24),
    stock: Joi.number().min(0),
    createdBy: Joi.string().hex().length(24),
    imgCover: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/jiff').required(),
        size: Joi.number().max(5242880).required(),
        buffer: Joi.any(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
    }),
    images: Joi.array().items(
        Joi.object({
            fieldname: Joi.string().required(),
            originalname: Joi.string().required(),
            encoding: Joi.string().required(),
            mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/jiff').required(),
            size: Joi.number().max(5242880).required(),
            buffer: Joi.any(),
            destination: Joi.string().required(),
            filename: Joi.string().required(),
            path: Joi.string().required(),
        }))
})


export {
    addProductVal,
    updateProductVal
}

