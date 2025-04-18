
import { errorCatch } from "../../middleWare/errorCatch.js";
import { AppError } from "../../utils/appError.js";
import { Cart } from "../../../database/models/cart.model.js";
import { Product } from "../../../database/models/products.model.js";
import { Coupon } from "../../../database/models/coupon.model.js";


function calcTotalPrice(cart) {
    cart.totalCartPrice = cart.cartItems.reduce((prev, item) => prev += item.quantity * item.price, 0)

    if (cart.cartDiscount || cart.cartDiscount == 0) {
        cart.cartTotalAfterDiscount = cart.totalCartPrice - (cart.totalCartPrice * cart.cartDiscount) / 100
    }
}

// add to cart and if its new user create new cart
const addToCart = errorCatch(async (req, res, next) => {
    //check if ther is cart or not
    let isCartExisit = await Cart.findOne({ user: req.user._id });
    let product = await Product.findById(req.body.product)
    if (!product) return next(new AppError("product not found", 404))
    req.body.price = product.price

    if (product.stock == 0) return next(new AppError("sorry, this item is sold Out", 404))
    if (req.body.quantity > product.stock && product.stock > 0) return next(new AppError(`Sorry , the available quantity is only ${product.stock} `, 404))

    if (!isCartExisit) {
        //create new cart
        let cart = await Cart({
            user: req.user._id,
            cartItems: [req.body]
        })
        calcTotalPrice(cart)
        await cart.save();
        res.status(200).send({ message: "success", cart });
    } else {
        //update cart
        let item = isCartExisit.cartItems.find(item => item.product == req.body.product)
        if (item) {
            item.quantity += req.body.quantity || 1
            if (item.quantity > product.stock) return next(new AppError("Sold Out", 404))

        } else {
            isCartExisit.cartItems.push(req.body)
        }
        calcTotalPrice(isCartExisit)
        await isCartExisit.save();
        res.status(200).send({ message: "success", cart: isCartExisit });
    }
})
// add to cart and if its new user create new cart
const getLoggedUserCart = errorCatch(async (req, res, next) => {
    //check if ther is cart or not
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return next(new AppError("cart not found", 404))
    res.status(200).send({ message: "success", cart });
})

// update quantity of a specific product directly
const updateQuantity = errorCatch(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return next(new AppError("cart not found", 404))
    const product = await Product.findById(req.params.id)
    if (!product) return next(new AppError("product not found", 404))
    if (req.body.quantity > product.stock) return next(new AppError("Sold Out", 404))

    const item = cart.cartItems.find(item => item.product == req.params.id)
    item.quantity = req.body.quantity
    calcTotalPrice(cart)
    await cart.save()
    res.status(200).send({ message: "success", cart })

})

// remove specific product from cart
const removeItemFromCart = errorCatch(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return next(new AppError("cart not found", 404))
    const product = await Product.findById(req.params.id)
    if (!product) return next(new AppError("product not found", 404))

    const item = cart.cartItems.find(item => item.product == req.params.id)
    if (!item) return next(new AppError("product not found", 404))
    await item.deleteOne()
    calcTotalPrice(cart)
    await cart.save()
    res.status(200).send({ message: "success", cart })
})
// remove specific product from cart
const clearUserCart = errorCatch(async (req, res, next) => {
    const cart = await Cart.findOneAndDelete({ user: req.user._id })
    if (!cart) return next(new AppError("cart not found", 404))
    res.status(200).send({ message: "deleted successfully", cart })
})

// Apply coupon to Cart
const applyCoupon = errorCatch(async (req, res, next) => {
    let coupon = await Coupon.findOne({ code: req.body.code, expireDate: { $gt: Date.now() } })
    if (!coupon) return next(new AppError("invalid coupon", 404))

    let cart = await Cart.findOne({ user: req.user._id })
    cart.cartDiscount = coupon.discount
    calcTotalPrice(cart)
    await cart.save()
    res.status(200).send({ message: "success", cart })
})
const removeCoupon = errorCatch(async (req, res, next) => {

    let cart = await Cart.findOne({ user: req.user._id })
    cart.cartDiscount = 0
    calcTotalPrice(cart)
    await cart.save()
    res.status(200).send({ message: "success", cart })
})



export {
    addToCart,
    updateQuantity,
    removeItemFromCart,
    getLoggedUserCart,
    clearUserCart,
    applyCoupon,
    removeCoupon
}