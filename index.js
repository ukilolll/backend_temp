import dotenv from "dotenv"
dotenv.config()

import express from "express"
import  body_parser from "body-parser"
import cookieParser from  "cookie-parser"
import cors from "cors"

import productRoute from "./routes/product.js"
import memberRoute from "./routes/member.js"
import cartRoute from "./routes/cart.js"

const app = express()
const port = process.env.PORT || 8080

app.use(cors({
    origin:['http://localhost:5173','http://127.0.0.1:5173'], //Domain ของ Frontend
    methods:['GET','POST','PUT','DELETE'], //Method ที่อนุญาต
    credentials:true  //ให้ส่งข้อมูล Header+Cookie ได้
}))

app.use(body_parser.json())
app.use(cookieParser())

app.use("/img_pd",express.static("img_pd"))
app.use(productRoute)
app.use(memberRoute)
app.use(cartRoute)

app.listen(port,()=>{
    console.log(`server running at port ${port}`)
})