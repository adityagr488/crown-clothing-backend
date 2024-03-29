import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { AuthenticatedRequest } from "../middlewares/isAuthenticated";
import Order, { OrderStatus } from "../models/order.model";
import Cart from "../models/cart.model";

export const getOrders = async(req: AuthenticatedRequest, res: Response)=>{
    const user = req.user;
    const orders = await Order.find({user: user}).populate('address').sort({ order_date: 'desc' });
    res.status(StatusCodes.OK).json(orders);
}

export const placeOrder = async(req: AuthenticatedRequest, res: Response)=>{
    const user = req.user;
    const orderDetails = req.body;
    const order = {
        user: user,
        order_date: orderDetails.order_date,
        items: orderDetails.items,
        totalItems: orderDetails.totalItems,
        totalAmount: orderDetails.totalAmount,
        orderStatus: OrderStatus.PROCESSING,
        paymentType: orderDetails.paymentType,
        address: orderDetails.address["id"]
    }
    try{
        // TODO: Check for payment status
        await Order.create(order);
        await Cart.updateOne({user: user}, { $set: { items: [] } });
        res.status(StatusCodes.CREATED).end();
    }catch(e){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Error creating order"});
    }
}