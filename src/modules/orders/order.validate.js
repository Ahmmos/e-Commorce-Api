// createCashOrder



import Joi from "joi";


const createCashOrderVal = Joi.object({
    id: Joi.string().hex().length(24).required(),
    shippingAddress: Joi.object({
        city: Joi.string().min(1).max(20).required(),
        street: Joi.string().min(1).max(300).required(),
        phone: Joi.string().pattern(/^(002|\+2)?01[0125][0-9]{8}$/).required(),
    }).required(),
})
const createCheckoutVal = Joi.object({
    id: Joi.string().hex().length(24).required(),
    shippingAddress: Joi.object({
        city: Joi.string().min(1).max(20).required(),
        street: Joi.string().min(1).max(300).required(),
        phone: Joi.string().pattern(/^(002|\+2)?01[0125][0-9]{8}$/).required(),
    }).required(),
})

export {
    createCashOrderVal,
    createCheckoutVal

}
