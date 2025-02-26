import Joi from "joi";


const addAdressVal = Joi.object({
    City: Joi.string().min(1).max(20),
    street: Joi.string().min(1).max(300),
    phone: Joi.string().pattern(/^(002|\+2)?01[0125][0-9]{8}$/).required(),
})

export {
    addAdressVal
}
