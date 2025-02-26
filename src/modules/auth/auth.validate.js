import Joi from "joi";


const signUpVal = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^_])[A-Za-z\d@.#$!%*?&^_]{8,15}$/
    ).required()
})

const singInVal = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^_])[A-Za-z\d@.#$!%*?&^_]{8,15}$/).required(),
})

const changePasswordVal = Joi.object({
    email: Joi.string().email().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^_])[A-Za-z\d@.#$!%*?&^_]{8,15}$/).required(),
})

export {
    signUpVal,
    singInVal,
    changePasswordVal
}
