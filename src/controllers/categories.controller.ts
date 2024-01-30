import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import Category from "../models/category.model";


// returns all the categories
export const getCategories = async (req: Request, res: Response) => {
    const categories = await Category.find();
    const serializedCategories = categories.map(category => {
        return {
            id: category.id,
            name: category.name,
            title: category.title,
            imageUrl: category.imageUrl
        };
    });
    res.status(StatusCodes.OK).json(serializedCategories);
}


// add a new category
export const addCategory = async (req: Request, res: Response) => {
    const { name, imageUrl, title } = req.body;
    const newCategory = await Category.create({ name, imageUrl, title });
    res.status(StatusCodes.OK).json(newCategory);
}