
// global Joi validate function to use for validation of all things comes from user

import { AppError } from "../utils/appError.js"



export const validate = (schema) => {
    return async (req, res, next) => {

        // the validate active for all requests types {file,body,params and query}
        // abort early:false ==> to stop abortion coz joi was returning the first error only 
        // if abort early is true

        let { error } = schema.validate(
            { image: req.file, ...req.body, ...req.params, ...req.query }, { abortEarly: false }
        )
        if (!error) {
            next()
        } else {
            // if there is an error, we return the message of it to the user with status code 401
            let errMsg = error.details.map(err => err.message)
            next(new AppError(errMsg, 400))
        }
    }
}