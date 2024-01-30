import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import Product from "../models/product.model";
import Category from "../models/category.model";

// get products for given categoryId
export const getProducts = async (req: Request, res: Response) => {
    const categoryId = req.params.categoryId;
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
        res.status(StatusCodes.NOT_FOUND).json({ error: "Category does not exist!" });
        return;
    }
    const products = await Product.find({ category: categoryId });
    const serializedProducts = products.map(product => {
        return {
            name: product.name,
            imageUrl: product.imageUrl,
            price: product.price,
        }
    })
    res.status(StatusCodes.OK).json(products);
}


// add products for given categoryId
export const addProduct = async (req: Request, res: Response) => {
    const categoryId = req.params.categoryId;
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
        res.status(StatusCodes.NOT_FOUND).json({ error: "Category does not exist!" });
        return;
    }
    const { name, imageUrl, price } = req.body;
    const newProduct = await Product.create({ name, imageUrl, price, category: categoryId });
    res.status(StatusCodes.OK).json(newProduct);
}