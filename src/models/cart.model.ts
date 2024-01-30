import mongoose, { model } from "mongoose";

import { UserInterface } from "./user.model";
import { ProductInterface } from "./product.model";

export interface CartItemInterface extends ProductInterface {
    quantity: number
}

export interface CartInterface extends mongoose.Document {
    user: UserInterface
    items: CartItemInterface[]
}

export const CartItemSchema = new mongoose.Schema<CartItemInterface>({
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
    },
    quantity: {
        type: Number,
        required: true
    }
});

const CartSchema = new mongoose.Schema<CartInterface>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: [CartItemSchema],
        required: true
    }
});

const Cart = model<CartInterface>("Cart", CartSchema);

export default Cart;
