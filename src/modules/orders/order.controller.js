
import { errorCatch } from "../../middleWare/errorCatch.js";
import { AppError } from "../../utils/appError.js";
import { Cart } from "../../../database/models/cart.model.js";
import { Product } from "../../../database/models/products.model.js";
import { Order } from "../../../database/models/order.model.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { User } from "../../../database/models/user.model.js";
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();



const stripeString = process.env.STRIPE_SECRET_KEY;


const stripe = new Stripe(stripeString);




// create cash order
const createCashOrder = errorCatch(async (req, res, next) => {
    // find the cart of the logged user
    const cart = await Cart.findOne({ _id: req.params.id, user: req.user._id })
    if (!cart) next(new AppError("cart not found or you are not authorized to make order", 404))

    const totalOrderPrice = cart.cartTotalAfterDiscount || cart.totalCartPrice
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

    const totalOrderPrice = cart.cartTotalAfterDiscount || cart.totalCartPrice

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

// create webhook for stripe
const createWebhook = errorCatch(async (req, res, next) => {

    // app.post('api/checkoutComplete', express.raw({type: 'application/json'}), (request, response) => {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature'].toString();
        event = stripe.webhooks.constructEvent(req.body, signature, "whsec_rgl1qVxondH7KwW9j8lSpVDx0BkyRSfi");
    }
    let checkout;
    // Handle the event
    if (event.type === 'checkout.session.completed') {
        checkout = event.data.object;

        // find the user by email
        let user = await User.findOne({ email: checkout.customer_email })
        // find the cart of the logged user
        const cart = await Cart.findOne({ _id: checkout.client_reference_id, user: user._id })
        if (!cart) next(new AppError("cart not found or you are not authorized to make order", 404))

        // create order
        const order = await Order({
            user: user._id,
            orderItems: cart.cartItems,
            shippingAddress: checkout.metadata,
            totalOrderPrice: checkout.amount_total / 100,
            paymepaymentType: "card",
            isPaid: true,
            paidAt: Date.now()
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
    }
    res.json({ message: "success", checkout });
});

// })



export {
    createCashOrder,
    getUserOrders,
    getAllOrders,
    createCheckoutSession,
    createWebhook
}
