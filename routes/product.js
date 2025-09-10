import express from "express"
import {getAllProduct,
    getProductById,
    postProduct,putProduct,
    deleteProduct,
    getProductByBrandId,
    getThreeProduct,
    getSearchProduct
} from "../controllers/product.js"

const route = express.Router()

route.get("/products/three",getThreeProduct)
route.get("/products",getAllProduct)
route.get("/products/:id",getProductById)
route.get("/products/search/:id",getSearchProduct)
route.post("/products",postProduct)
route.put("/products/:id",putProduct)
route.delete("/products/:id",deleteProduct)
route.get("/products/brands/:id",getProductByBrandId)

export default  route