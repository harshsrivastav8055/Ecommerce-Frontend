import { TryCatch } from "../middlewares/error.js";
import { Request } from "express";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
// import {redis, redisTTL } from "../app.js";
import { rm } from "fs";
import mongoose from "mongoose";
import { invalidateCache } from "../utils/features.js";

import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { myCache } from "../app.js";



export const getlatestProducts = TryCatch(async (req, res, next) => {
  let products ;

  products = await myCache.get("latest-products");

  if (products) products = JSON.parse(products);
  else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    myCache.set("latest-products" ,  JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});


export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;

  categories = await myCache.get("categories");

  if (categories) categories = JSON.parse(categories);
  else {
    categories = await Product.distinct("category");
    myCache.set("categories",  JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;

  products = await myCache.get("all-products");

  if (products) products = JSON.parse(products);
  else {
    products = await Product.find({});
    myCache.set("all-products", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});


export const getSingleProduct = TryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id;
  const key = `product-${id}`;

  product = await myCache.get(key);
  if (product) product = JSON.parse(product);
  else {
    product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    myCache.set(key, JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

export const newProduct = TryCatch(async (req:Request<{} , {} , NewProductRequestBody> , res , next)=> {
  const {name , price , stock , category} = req.body;
  const photo = req.file;
  if(!photo)return next(new ErrorHandler("Please Add Photo" , 400));
  if(!name || !price || !stock || !category){
      rm(photo.path , ()=>{
         console.log("Deleted"); 
      });

      return next(new ErrorHandler("Please Enter All Fields" , 400));
  }
  await Product.create({
      name,
      price,
      stock,
      category:category.toLowerCase(),
      photo:photo.path,
  });

  await invalidateCache({product:true})

  return res.status(201).json({
      success:true,
      message:"Product Created Successfully",
  });
});

export const updateProduct = TryCatch(async (req, res , next)=> {
    const {id} = req.params;
    const {name , price , stock , category} = req.body;
    const photo = req.file;
    const product = await Product.findById(id);

    if(!product)return next(new ErrorHandler("Invalid Product Id" , 404));

    
    
    if(photo){
        rm(product.photo!, ()=>{
           console.log("Old Photo Deleted"); 
        });
        product.photo = photo.path;
    }
    if(name)product.name = name;
    if(price)product.price = price;
    if(stock)product.stock = stock;
    if(category)product.category = category;

    product.save(); 

    await invalidateCache({product:true});

    return res.status(200).json({
        success:true,
        message:"Product Updated Successfully",
    });
});

export const deleteProduct = TryCatch(async (req, res , next)=> {
    const product = await Product.findById(req.params.id);
    if(!product)return next(new ErrorHandler("Invalid Product Id" , 404));
    rm(product.photo!, ()=>{
        console.log("Old Photo Deleted"); 
     });
     await invalidateCache({product:true})
    return res.status(200).json({
        success:true,
        message:"Product Deleted Successfully"
    });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    
    const key = `products-${search}-${sort}-${category}-${price}-${page}`;
    let products;
    let totalPage;

    // Check cache first
    const cachedData = await myCache.get(key);
    if (cachedData) {
      const data = JSON.parse(cachedData);
      totalPage = data.totalPage;
      products = data.products;
    } else {
      // Create base query object
      const baseQuery: BaseQuery = {};

      if (search)
        baseQuery.name = {
          $regex: search,
          $options: "i",
        };

      if (price)
        baseQuery.price = {
          $lte: Number(price),
        };

      if (category) baseQuery.category = category;

      // Fetch products and total count of filtered products
      const [productsFetched, totalCount] = await Promise.all([
        Product.find(baseQuery)
          .sort(sort && { price: sort === "asc" ? 1 : -1 })
          .limit(limit)
          .skip(skip),
        Product.countDocuments(baseQuery),
      ]);

      products = productsFetched;
      totalPage = Math.ceil(totalCount / limit);

      // Cache the results for 30 seconds
      myCache.set(key, JSON.stringify({ products, totalPage }), 30);
    }

    // Send response
    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);
