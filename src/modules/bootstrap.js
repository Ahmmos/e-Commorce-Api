import categoryRouter from "./category/category.route.js"
import brandRouter from "./brand/brand.route.js"
import subCategoryRouter from "./subCategory/subCategory.route.js"





export const bootstrap = (app) => {
   app.use('/api/categories', categoryRouter)
   app.use('/api/subcategories', subCategoryRouter)
   app.use('/api/brands', brandRouter)
}