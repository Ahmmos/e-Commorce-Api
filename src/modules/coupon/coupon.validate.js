// //     "code":"Ahmos50",
// "expireDate": "1/30/2025",
// "discount":"50"


import Joi from "joi";

const addCouponVal = Joi.object({
    code: Joi.string().min(3).max(50).required(),
    expireDate: Joi.string().pattern(/(0[1-9]|[12][0-9]|3[01])(\/|-)(0[1-9]|1[1,2])(\/|-)(202)\d{1}/).required(),
    discount: Joi.number().min(1).required()
})

const updateCouponVal = Joi.object({
    id: Joi.string().hex().length(24).required(),
    code: Joi.string().min(3).max(50),
    expireDate: Joi.string().pattern(/(0[1-9]|[12][0-9]|3[01])(\/|-)(0[1-9]|1[1,2])(\/|-)(202)\d{1}/),
    discount: Joi.number().min(1)
})

export {
    addCouponVal,
    updateCouponVal
}