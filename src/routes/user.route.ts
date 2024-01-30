import { Router } from "express";

import { createUser, authenticateUser, checkUserSession, addUserAddress, updateUserAddress, deleteUserAddress } from "../controllers/user.controller";
import IsAuthenticated from "../middlewares/isAuthenticated";
import { placeOrder, getOrders } from "../controllers/orders.controller";
import CartRouter from "./cart.route";

const UserRouter = Router();

UserRouter.route("/session").get(checkUserSession);
UserRouter.route("/login").post(authenticateUser);


UserRouter.route("").post(createUser);
    
UserRouter.route("/addresses").post(IsAuthenticated, addUserAddress);
UserRouter.route("/addresses/:addressId")
    .put(IsAuthenticated, updateUserAddress)
    .delete(IsAuthenticated, deleteUserAddress);

UserRouter.use("/cart", CartRouter);

UserRouter.route("/orders")
    .get(IsAuthenticated, getOrders)
    .post(IsAuthenticated, placeOrder);


export default UserRouter;