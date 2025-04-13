import { User } from "../../../database/models/user.model.js"
import bcrypt from "bcrypt"
import { AppError } from "../../utils/appError.js"
import { errorCatch } from "../../middleWare/errorCatch.js"
import jwt from "jsonwebtoken"
import { sendEmail } from "../../mailSender/mail.js"




// create new user and create token to login directly after success signup
const signUp = errorCatch(async (req, res, next) => {
    let user = await User(req.body)
    sendEmail(req.body.email)
    await user.save()
    user.password = undefined

    jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY,
        (err, token) => res.status(200).json({ Message: "added successfully", token }))
})

// login to app and create token for authorization

const signIn = errorCatch(async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ "email": email })
    if (user.confirmEmail === false) return next(new AppError("please confirm your email firstly", 401))
    if (!user || !bcrypt.compareSync(password, user.password)) return next(new AppError("incorrect email or Password ", 401))


    jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY,
        (err, token) => res.status(200).json({ Message: "login successfully", token }))
})


// change user password

const changeUserPassword = errorCatch(async (req, res, next) => {
    const { email, oldPassword, newPassword } = req.body
    // const { oldPassword, newPassword } = req.body
    const user = await User.findOne({ "email": email })
    // const user = await User.findById({ req.user.userId })

    if (!user || !bcrypt.compareSync(oldPassword, user.password)) return next(new AppError("incorrect email or Password ", 401))

    await User.findOneAndUpdate({ "email": email }, { password: newPassword, passwordChangedAt: Date.now() })
    // await User.findByIdAndUpdate({ req.user.userId  }, { password: newPassword, passwordChangedAt: Date.now() })

    jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY,
        (err, token) => res.status(200).json({ Message: "password changed & login successfully", token }))


})

// protected Routes ==> to protect all routes and define (authentication) 
//  how it works? 
//  1- check if token exisit or not , 2- verify token 
//  3- check userId , 4- token valid or not (check iat ==> intiated at)

const protectedRoutes = errorCatch(async (req, res, next) => {
    //  1- check if token exisit or not
    let { token } = req.headers
    if (!token) return next(new AppError("token not provided", 401))
    let userPayload = null

    // 2- verify token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {

        if (err) return next(new AppError("invalid token", 401))
        userPayload = payload
    })
    // 3- check userId
    const user = await User.findById(userPayload.userId)
    if (!user) return next(new AppError("invalid token.. user not found", 404))

    //4- token valid or not (check iat ==> intiated at)
    // use gettime to get time in milliseconds then transform to seconds
    if (user.passwordChangedAt) {
        let time = parseInt(user.passwordChangedAt.getTime() / 1000)
        let tokenTime = parseInt(userPayload.iat)
        if (time > tokenTime) return next(new AppError("invalid token ... login again", 401))
    }
    req.user = user
    next()
})

// allowedto ==> function to determin who has the authority to do the operation inside the project (authorization)

const allowedTo = (...roles) => {

    return errorCatch(async (req, res, next) => {
        if (roles.includes(req.user.role)) return next()
        return next(new AppError("you are not authorized to do this operation", 401))
    })
}

// confirm email
const confirmEmail = errorCatch(async (req, res, next) => {

    jwt.verify(req.params.token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) next(new AppError("invalid email"), 400)
        const user = await User.findOneAndUpdate({ email: decoded.email }, { confirmEmail: true })
        user || next(new AppError("user not found"), 404)
        res.status(200).send({ message: "email confirmed successfully", email: user.email })
    })


})

export {
    signUp,
    signIn,
    changeUserPassword,
    protectedRoutes,
    allowedTo,
    confirmEmail
}