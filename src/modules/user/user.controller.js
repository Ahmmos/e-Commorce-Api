
import { errorCatch } from "../../middleWare/errorCatch.js";
import { AppError } from "../../utils/appError.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { User } from "../../../database/models/user.model.js";


// add new user
const addUser = errorCatch(async (req, res, next) => {
    const user = await User(req.body)
    await user.save()
    res.status(200).send({ message: "added successfully", user })
})

// get all users
const getUsers = errorCatch(async (req, res, next) => {

    let apiFeature = new ApiFeature(User.find(), req.query)
        .pagination(User).fields().sort().search().filter()

    let users = await apiFeature.mongooseQuery
    let totalusers = (await User.find()).length

    res.status(200).send({
        message: "success", metadata: {
            total: totalusers,
            currentPage: apiFeature.pageNumber,
            limit: apiFeature.limit,
            numberOfPages: Math.ceil(totalusers / apiFeature.limit),
            nextPage: apiFeature.nextPage
        }, users
    })
})

// get user by id
const getUser = errorCatch(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    // instead of if condition to check if user we use it coz its faster
    user || next(new AppError("user not found"), 404)
    !user || res.status(200).send({ message: "success", user })
})

// update user by id
const updateUser = errorCatch(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    user || next(new AppError("user not found"), 404)
    !user || res.status(200).send({ message: "updated successfully", user })
})

// delete user by id
const deleteUser = errorCatch(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)
    user || next(new AppError("user not found"), 404)
    !user || res.status(200).send({ message: "deleted successfully", user })
})



export {
    addUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
}