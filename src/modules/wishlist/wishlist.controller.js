
import { errorCatch } from "../../middleWare/errorCatch.js";
import { AppError } from "../../utils/appError.js";
import { User } from "../../../database/models/user.model.js";




// add to wishlist is already an update of user
const addToWishlist = errorCatch(async (req, res, next) => {

    // use addToSet ==> because if the item is already exisit will not be added agian in opposite push add again 
    const wishlist = await User.findByIdAndUpdate(req.user._id,
        { $addToSet: { wishlist: req.body.product } }, { new: true })
    wishlist || next(new AppError("user not found"), 404)
    !wishlist || res.status(200).send({ message: "product added successfully ", wishlist: wishlist.wishlist })
})

// remove from wishlist is already an update of user
const removeFromWishlist = errorCatch(async (req, res, next) => {
    // use pull not pop ==> because pop remove specific element but pop remove last array element only
    const wishlist = await User.findByIdAndUpdate(req.user._id,
        { $pull: { wishlist: req.params.id } }, { new: true })

    wishlist || next(new AppError("user not found"), 404)
    !wishlist || res.status(200).send({ message: "product removed successfully", wishlist: wishlist.wishlist })
})


// get all wish list products for a logged user

const getLoggedUserWishlist = errorCatch(async (req, res, next) => {
    const wishlist = await User.findById(req.user._id).populate("wishlist")

    wishlist || next(new AppError("user not found"), 404)
    !wishlist || res.status(200).send({ message: "success", wishlist: wishlist.wishlist })
})



export {
    addToWishlist,
    removeFromWishlist,
    getLoggedUserWishlist
}