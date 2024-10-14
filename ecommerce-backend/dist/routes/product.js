import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getlatestProducts, getSingleProduct, newProduct, updateProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
// To Create New Product - /api/v1/product/new
app.post("/new", adminOnly, singleUpload, newProduct);
// To Get Latest or 10 Products - /api/v1/product/latest
app.get("/latest", getlatestProducts);
// To Categorize the products - /api/v1/product/categories
app.get("/categories", getAllCategories);
// To get all products in admin side - /api/v1/product/admin-products
app.get("/admin-products", getAdminProducts);
//To get all Products with filters  - /api/v1/product/all
app.get("/all", getAllProducts);
app.route("/:id")
    .get(getSingleProduct)
    .put(singleUpload, updateProduct)
    .delete(deleteProduct);
export default app;
