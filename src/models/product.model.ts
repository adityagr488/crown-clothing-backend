import mongoose, { model } from "mongoose";

import { CategoryInterface } from "./category.model";

export interface ProductInterface extends mongoose.Document {
    name: string,
    imageUrl: string,
    price: number,
    category: CategoryInterface
}

const ProductSchema = new mongoose.Schema<ProductInterface>({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

const Product = model<ProductInterface>("Product", ProductSchema);

export default Product;