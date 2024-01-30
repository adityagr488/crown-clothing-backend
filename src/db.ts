import mongoose from "mongoose";
import Product from "./models/product.model";

const ConnectDB = async () => {
    try {
        const client = await mongoose.connect(process.env.MONGODB_URL!);
        console.log(`Connected to db.`);
    } catch (err) {
        console.log(`Error connecting to db: ${err}`);
        process.exit(1);
    }
}

export default ConnectDB;