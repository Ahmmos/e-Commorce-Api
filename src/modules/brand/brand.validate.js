
import Joi from "joi";


const addBrandVal = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    logo: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png', 'image/gif').required(),
        size: Joi.number().max(5242880).required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        buffer: Joi.any(),
    }).required()
})
const updateBrandVal = Joi.object({
    id: Joi.string().hex().length(24).required(),
    name: Joi.string().min(3).max(50),
    logo: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png', 'image/gif').required(),
        size: Joi.number().max(5242880).required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        buffer: Joi.any(),
    })
})

export {
    addBrandVal,
    updateBrandVal
}