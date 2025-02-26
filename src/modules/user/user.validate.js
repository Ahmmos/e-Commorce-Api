
import Joi from "joi";


const addUserVal = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^_])[A-Za-z\d@.#$!%*?&^_]{8,15}$/).required(),
    role: Joi.string().valid('admin', 'user').required(),
    isBloked: Joi.boolean().default(false),
    confirmEmail: Joi.boolean().default(false)

})
const upddateUserVal = Joi.object({
    id: Joi.string().hex().length(24).required(),
    name: Joi.string().min(1).max(50),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^_])[A-Za-z\d@.#$!%*?&^_]{8,15}$/),
    role: Joi.string().valid('admin', 'user'),
    isBloked: Joi.boolean().default(false),
    confirmEmail: Joi.boolean().default(false)

})

export {
    addUserVal,
    upddateUserVal
}
