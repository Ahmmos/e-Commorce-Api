import Joi from "joi";


const addReviewVal = Joi.object({
    product: Joi.string().hex().length(24).required(),
    rate: Joi.number().min(1).max(5),
    comment: Joi.string().min(1).max(300),
})

const updateReviewVal = Joi.object({
    user: Joi.string().hex().length(24),
    product: Joi.string().hex().length(24),
    rate: Joi.number().min(1).max(5),
    comment: Joi.string().min(1).max(300),
    id: Joi.string().hex().length(24).required()
})

export {
    addReviewVal,
    updateReviewVal
}