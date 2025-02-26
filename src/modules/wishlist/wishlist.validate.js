import Joi from "joi";


const addWishlistVal = Joi.object({
    product: Joi.string().hex().length(24).required()
})

export {
    addWishlistVal
}