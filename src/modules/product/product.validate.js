
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
            destination: Joi.string().required(),
            filename: Joi.string().required(),
            path: Joi.string().required(),
        }).required()).required()
})

export {
    addProductVal
}

