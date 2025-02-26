
import Joi from "joi";


const addCategoryVal = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/jiff').required(),
        size: Joi.number().max(5242880).required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        buffer: Joi.any(),
    }).required()
})
const updateCategoryVal = Joi.object({
    id: Joi.string().hex().length(24).required(),
    name: Joi.string().min(1).max(50),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/jiff').required(),
        size: Joi.number().max(5242880).required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        buffer: Joi.any(),
    })
})

export {
    addCategoryVal,
    updateCategoryVal
}