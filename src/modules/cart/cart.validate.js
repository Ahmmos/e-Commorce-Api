import Joi from "joi";


const addToCartVal = Joi.object({
    product: Joi.string().hex().length(24).required(),
    quantity: Joi.number().min(1).required(),
})

const updateQuantityVal = Joi.object({
    quantity: Joi.number().min(1).required(),
    id: Joi.string().hex().length(24).required()

})
const applyCouponVal = Joi.object({
    code: Joi.string().min(3).required()

})

export {
    addToCartVal,
    updateQuantityVal,
    applyCouponVal
}
