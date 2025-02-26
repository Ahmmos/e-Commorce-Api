import categoryRouter from "./category/category.route.js"
import brandRouter from "./brand/brand.route.js"
import subCategoryRouter from "./subCategory/subCategory.route.js"
import productRouter from "./product/products.route.js"
import userRouter from "./user/user.route.js"
import authRouter from "./auth/auth.route.js"
import reviewRouter from "./review/review.route.js"
import wishlistRouter from "./wishlist/wishlist.route.js"
import addressRouter from "./address/address.route.js"
import couponRouter from "./coupon/coupon.route.js"
import cartRouter from "./cart/cart.route.js"
import orderRouter from "./orders/order.route.js"





export const bootstrap = (app) => {
   app.use('/api/categories', categoryRouter)
   app.use('/api/subcategories', subCategoryRouter)
   app.use('/api/brands', brandRouter)
   app.use('/api/products', productRouter)
   app.use('/api/users', userRouter)
   app.use('/api/auth', authRouter)
   app.use('/api/reviews', reviewRouter)
   app.use('/api/wishlists', wishlistRouter)
   app.use('/api/addresses', addressRouter)
   app.use('/api/coupons', couponRouter)
   app.use('/api/carts', cartRouter)
   app.use('/api/orders', orderRouter)
}