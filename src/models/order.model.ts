import mongoose, { model } from "mongoose";

import { UserInterface } from "./user.model";
import { CartItemInterface, CartItemSchema } from "./cart.model";
import { AddressInterface } from "./address.model";

export enum OrderStatus {
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    RETURNED = "RETURNED"
}

export enum PaymentType {
    UPI = "UPI",
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    NET_BANKING = "NET_BANKING",
    CASH = "CASH"
}

export interface OrderInterface extends mongoose.Document {
    user: UserInterface
    date: Date
    items: CartItemInterface[]
    totalItems: number
    totalAmount: number
    orderStatus: OrderStatus
    paymentType: PaymentType
    address: AddressInterface
}

const OrderSchema = new mongoose.Schema<OrderInterface>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    items: {
        type: [CartItemSchema],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: Object.values(OrderStatus),
        required: true
    },
    paymentType: {
        type: String,
        enum: Object.values(PaymentType),
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    }
});

const Order = model("Order", OrderSchema);

export default Order;