import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

import { AuthenticatedRequest } from "../middlewares/isAuthenticated";
import Cart from "../models/cart.model";

export const getItemsFromCart = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const cart = await Cart.findOne({user: user});
    res.status(StatusCodes.OK).json(cart?.items);
}

export const addItemToCart = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const cart = await Cart.findOne({user: user});
    const productToAdd = req.body;
    const productToAddId = new mongoose.Types.ObjectId(productToAdd._id);
        
    const productToAddFound = cart?.items.find((item) => item._id.equals(productToAddId));

    if (productToAddFound) {
        // @ts-ignore
        cart!.items = cart?.items.map((cartItem) => (
            cartItem._id.equals(productToAddId)
                ?
                { ...cartItem, quantity: cartItem.quantity + 1 }
                :
                cartItem
        ));
    }else{
        cart!.items = [...cart!.items, { ...productToAdd, quantity: 1 }];
    }
    cart?.save();
    res.status(StatusCodes.CREATED).json(cart?.items);
}

export const removeItemFromCart = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const cart = await Cart.findOne({user: user});
    const productToRemove = req.body;
    const productToRemoveId = new mongoose.Types.ObjectId(productToRemove._id);
        
    if (productToRemove.quantity === 1) {
        // @ts-ignore
        cart!.items = cart?.items.filter((cartItem) => !cartItem._id.equals(productToRemoveId));
    }
    else{
        // @ts-ignore
        cart!.items = cart?.items.map((cartItem) => (
            cartItem._id.equals(productToRemoveId)
                ?
                { ...cartItem, quantity: cartItem.quantity - 1 }
                :
                cartItem
        ));
    }
    cart?.save();
    res.status(StatusCodes.OK).json(cart?.items);
}

export const clearItemFromCart = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const cart = await Cart.findOne({user: user});
    const productToClear = req.body;
    const productToClearId = new mongoose.Types.ObjectId(productToClear._id);
    // @ts-ignore
    cart!.items = cart?.items.filter((cartItem) => !cartItem._id.equals(productToClearId));
    cart?.save();
    res.status(StatusCodes.OK).json(cart?.items);
}