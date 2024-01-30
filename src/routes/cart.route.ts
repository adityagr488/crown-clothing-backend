import { Router } from "express";

import authenticate from "../middlewares/isAuthenticated";
import { addItemToCart, clearItemFromCart, getItemsFromCart, removeItemFromCart } from "../controllers/cart.controller";

const CartRouter = Router();

CartRouter.route("").get(authenticate, getItemsFromCart);
CartRouter.route("/add").post(authenticate, addItemToCart);
CartRouter.route("/remove").post(authenticate, removeItemFromCart);
CartRouter.route("/clear").post(authenticate, clearItemFromCart);


export default CartRouter;