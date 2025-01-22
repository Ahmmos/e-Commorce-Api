
import { errorCatch } from "../../middleWare/errorCatch.js";
import { AppError } from "../../utils/appError.js";
import { User } from "../../../database/models/user.model.js";




// add to address is already an update of user addresses array
const addAddress = errorCatch(async (req, res, next) => {

    const address = await User.findByIdAndUpdate(req.user._id,
        { $push: { addresses: req.body } }, { new: true })
    address || next(new AppError("user not found"), 404)
    !address || res.status(200).send({ message: "address added successfully ", address: address.addresses })
})

// remove address is already an update of user addresses array

const removeAddress = errorCatch(async (req, res, next) => {

    const address = await User.findByIdAndUpdate(req.user._id,
        { $pull: { addresses: { _id: req.params.id } } }, { new: true })

    address || next(new AppError("user not found"), 404)
    !address || res.status(200).send({ message: "product removed successfully", address: address.addresses })
})


// get all addresses for a logged user

const getLoggedUserAddresses = errorCatch(async (req, res, next) => {
    const address = await User.findById(req.user._id).populate("addresses")

    address || next(new AppError("user not found"), 404)
    !address || res.status(200).send({ message: "success", addresses: address.addresses })
})



export {
    addAddress,
    removeAddress,
    getLoggedUserAddresses
}