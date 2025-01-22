
import Joi from "joi";


const addUserVal = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/).required(),
    role: {
        type: String,
        enum: ['admin', 'user'], // Restricting the role to specific values
        required: true
    },
    isBloked: {
        type: Boolean,
        default: false
    },
    confirmEmail: {
        type: Boolean,
        default: false
    }


})

export {
    addUserVal
}


// const singUpVal = Joi.object({
//     firstName: Joi.string().min(3).max(30).required(),
//     lastName: Joi.string().min(3).max(30).required(),
//     username: Joi.string().min(6).max(30).required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/).required(),
//     rePassword: Joi.valid(Joi.ref('password')).required(),
//     recoveryEmail: Joi.string().email().required(),
//     DOB: Joi.string().required(),
//     mobileNumber: Joi.string().pattern(/^(002|\+2)?01[0125][0-9]{8}$/).required(),
//     role: Joi.string().required(),
//     status: Joi.string()
// })

// const singInVal = Joi.object({
//     email: Joi.string().email(),
//     password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/).required(),
//     mobileNumber: Joi.string().pattern(/^(002|\+2)?01[0125][0-9]{8}$/),
// }).xor("email", "mobileNumber")

// const resetPasswordVal = Joi.object({
//     OTP: Joi.number().min(6),
//     newPassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/).required(),
//     rePassword: Joi.valid(Joi.ref('newPassword')).required(),
// })
// const updatePasswordVal = Joi.object({
//     oldPassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/).required(),
//     newPassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/).required(),
//     rePassword: Joi.valid(Joi.ref('newPassword')).required(),
// })