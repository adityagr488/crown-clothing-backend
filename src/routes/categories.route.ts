import { Router } from "express";

import { addCategory, getCategories } from "../controllers/categories.controller";
import { addProduct, getProducts } from "../controllers/product.controller";

const CategoriesRouter = Router();

CategoriesRouter.route("").get(getCategories).post(addCategory);
CategoriesRouter.route("/:categoryId/products").get(getProducts).post(addProduct);

export default CategoriesRouter;