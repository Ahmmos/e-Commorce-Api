
import { errorCatch } from "../../middleWare/errorCatch.js";
import { AppError } from "../../utils/appError.js";
import { Cart } from "../../../database/models/cart.model.js";
import { Product } from "../../../database/models/products.model.js";
import { Order } from "../../../database/models/order.model.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();



const stripeString = process.env.DB_URL;


const stripe = new Stripe(stripeString);



// create cash order
const createCashOrder = errorCatch(async (req, res, next) => {
    // find the cart of the logged user
    const cart = await Cart.findOne({ _id: req.params.id, user: req.user._id })
    if (!cart) next(new AppError("cart not found or you are not authorized to make order", 404))

    const totalOrderPrice = cart.cartTotalAfterDiscount || cart.calcTotalPrice
    // create order
    const order = await Order({
        user: req.user._id,
        orderItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice
    })
    await order.save()

    // increment sold and decrement stock using bulkWrite
    const products = cart.cartItems.map((item) => {
        return ({
            updateOne: {
                "filter": { _id: item.product },
                "update": { $inc: { sold: +item.quantity, stock: -item.quantity } }
            }
        })
    })
    // bulkWrite ==> used to update more than one option for more than document in only one trip which is faster 
    Product.bulkWrite(products)
    // clear user cart after purchase
    await cart.deleteOne()

    res.status(200).send({ message: "success", order })

})


// get user orders
// mergeParams users/id/orders
const getUserOrders = errorCatch(async (req, res, next) => {

    let orders = await Order.find({ user: req.user._id })
    if (!orders.length) return next(new AppError("thers is no orders", 404))
    res.status(200).send({ message: "success", total: orders.length, orders })
})
// get all orders by admin only
const getAllOrders = errorCatch(async (req, res, next) => {
    // mergeparams
    if (req.params.userId) {
        let apiFeature = new ApiFeature(Order.find({ user: req.params.userId }).populate("orderItems.product"), req.query)
            .pagination(Order).fields().sort().search().filter()

        let orders = await apiFeature.mongooseQuery
        if (!orders.length) next(new AppError("user has no orders", 404))
        let totalOrders = (await Order.find({})).length

        res.status(200).send({
            message: "success", metadata: {
                total: totalOrders,
                currentPage: apiFeature.pageNumber,
                limit: apiFeature.limit,
                numberOfPages: Math.ceil(totalOrders / apiFeature.limit),
                nextPage: apiFeature.nextPage
            }, orders
        })
    } else {
        let apiFeature = new ApiFeature(Order.find({}).populate("orderItems.product"), req.query)
            .pagination(Order).fields().sort().search().filter()

        let orders = await apiFeature.mongooseQuery
        if (!orders.length) next(new AppError("thers is no orders", 404))
        let totalOrders = ((await Order.find({})).length)

        res.status(200).send({
            message: "success", metadata: {
                total: totalOrders,
                currentPage: apiFeature.pageNumber,
                limit: apiFeature.limit,
                numberOfPages: Math.ceil(totalOrders / apiFeature.limit),
                nextPage: apiFeature.nextPage
            }, orders
        })
    }
})

// create checkout session
const createCheckoutSession = errorCatch(async (req, res, next) => {
    // find the cart of the logged user
    const cart = await Cart.findOne({ _id: req.params.id, user: req.user._id })
    if (!cart) next(new AppError("cart not found or you are not authorized to make order", 404))

    const totalOrderPrice = cart.cartTotalAfterDiscount || cart.calcTotalPrice

    // from stripe documentation 
    // create session that has the total price with the name of the user if you want 
    // to add more details about the user "image" or about the product add it inside product_data object 
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    unit_amount: totalOrderPrice * 100,
                    product_data: {
                        name: req.user.name
                    }
                },
                quantity: 1
            }
        ],
        mode: 'payment',
        // front-end urls when the success and cancel done
        success_url: `https://freshcart-ahmmos.netlify.app/home`,
        cancel_url: `https://freshcart-ahmmos.netlify.app/cart`,

        customer_email: req.user.email,
        client_reference_id: req.params.id,
        metadata: req.body.shippingAddress
    });

    res.status(200).send({ message: "success", session })
})
export {
    createCashOrder,
    getUserOrders,
    getAllOrders,
    createCheckoutSession
}