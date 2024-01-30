import mongoose, { Schema, model } from "mongoose";

import { UserInterface } from "./user.model";

export interface AddressInterface {
    user: UserInterface
    tag: string
    houseNo: string
    area: string
    city: string
    state: string
    pincode: number
    mobileNo: number
}

export const AddressSchema = new Schema<AddressInterface>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tag:{
        type: String,
        required: true
    },
    houseNo: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    mobileNo:{
        type: Number,
        required: true,
        maxlength: 10
    }
});

const Address = model<AddressInterface>("Address", AddressSchema);

export default Address;