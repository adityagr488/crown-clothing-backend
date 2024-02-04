import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "../middlewares/isAuthenticated";
import { MongooseError, ObjectId } from "mongoose";

import User, { UserInterface, UserRole } from "../models/user.model";
import Cart from "../models/cart.model";
import Address from "../models/address.model";
import { checkPassword, hashPassword } from "../utils/encrypt.utils";

const getAddressDetails = async (user: UserInterface | ObjectId) => {
    const userAddresses = await Address.find({ user: user });
    const addresDetails = userAddresses.map((address) => {
        return {
            tag: address.tag,
            id: address._id,
            houseNo: address.houseNo,
            area: address.area,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            mobileNo: address.mobileNo
        }
    });
    return addresDetails;
}

const getUserDetails = async (user: UserInterface) => {
    const addresDetails = await getAddressDetails(user);
    return {
        name: user?.name,
        email: user?.email,
        addresses: addresDetails
    }
}

// authenticate a user
export const authenticateUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
        res.status(404).json({ error: "User with this email not found!" });
        return;
    }

    const isValidPassword = await checkPassword(user!.password, password);
    if (!isValidPassword) {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid password!" });
        return;
    }

    const accessToken = jwt.sign({
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET_KEY!, { expiresIn: process.env.SESSION_TIMEOUT_DURATION || "10s" });
    const userDetails = await getUserDetails(user);
    const userDetailsWithToken = { ...userDetails, token: accessToken }
    res.status(StatusCodes.OK).json(userDetailsWithToken);
    return;
}


// create a new user
export const createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "All fields are required!" });
        return;
    }
    const hashedPassword = await hashPassword(password);
    const existingUser = await User.exists({ email: email });
    if (existingUser) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "User with this email already exists!" });
    }
    else {
        try {
            const user = await User.create({
                name: name,
                email: email,
                password: hashedPassword,
                role: UserRole.USER
            });
            await Cart.create({
                user: user,
                items: []
            })

            res.status(StatusCodes.CREATED).end();
        } catch {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error creating new user!" });
        }
    }
};


// verify the JWT Token of an existing user
export const checkUserSession = async (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "Authorization denied. No token provided." });
        return;
    }
    const [type, token] = authHeader.split(" ");
    if (type.toLowerCase() !== "bearer") {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "Authorization denied. Invalid token type." });
        return;
    }
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY!) as jwt.JwtPayload;
        const user = await User.findOne({ email: decodedData.email });
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({error: "User does not exist."});
            return;
        }
        const userDetails = await getUserDetails(user);
        res.status(StatusCodes.OK).json(userDetails);
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: "Session expired. Please login again to continue."});
    }
}

// add user address
export const addUserAddress = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const address = req.body;
    address.user = user;
    try {
        await Address.create(address);
        const addresses = await getAddressDetails(user!);
        res.status(StatusCodes.CREATED).json(addresses);
        return;
    } catch (e: any) {
        if (e instanceof MongooseError) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "All fields are required." });
            return
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Error." });
            return
        }
    }
}

// update user address
export const updateUserAddress = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const addressId = req.params.addressId;
    const address = req.body;
    try {
        await Address.updateOne({ _id: addressId, user: user }, { $set: address });
        const addresses = await getAddressDetails(user!);
        res.status(StatusCodes.OK).json(addresses);
    } catch (e: any) {
        if (e instanceof MongooseError) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "All fields are required." });
            return
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Error." });
            return
        }
    }
}

// delete user address
export const deleteUserAddress = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const addressId = req.params.addressId;
    await Address.deleteOne({ _id: addressId, user: user });
    const addresses = await getAddressDetails(user!);
    res.status(StatusCodes.OK).json(addresses);
}