import dotenv from "dotenv"
dotenv.config()

import express from "express"
import  body_parser from "body-parser"
import cors from "cors"

import route from "./routes/product.js"

const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(body_parser.json())

app.use("/img_pd",express.static("img_pd"))
app.use(route)

app.listen(port,()=>{
    console.log(`server running at port ${port}`)
})