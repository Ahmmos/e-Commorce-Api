// used to handel in error in the code 
process.on("uncaughtException", (err) => {
    console.log("error in code", err)
})

import express from 'express'
import { dbConnection } from './database/dbConnection.js'
import { globalError } from './src/middleWare/globalErrorHandling.js'
import {bootstrap} from './src/modules/bootstrap.js'


const app = express()
const port = 3000
app.use(express.json())
app.use("/uploads", express.static('uploads'))



bootstrap(app)
app.use(globalError)

// used to handel errors outside the express app like (db Connection)
process.on("unhandeledRejection", (err) => {
    console.log("internal error", err)
})
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))



