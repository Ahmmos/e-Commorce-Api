
import { User } from '../../database/models/user.model.js'
import { AppError } from '../utils/appError.js'

const checkEmail = async (req, res, next) => {

    const isFound = await User.findOne({ email: req.body.email })
    if (isFound) return next(new AppError("email is already exsist", 409))
    next()
}

export {
    checkEmail,

}