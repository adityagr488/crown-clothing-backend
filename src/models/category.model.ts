import mongoose, { model } from "mongoose";

export interface CategoryInterface extends mongoose.Document {
    name: string
    title: string
    imageUrl: string
}

const CategorySchema = new mongoose.Schema<CategoryInterface>({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});

const Category = model<CategoryInterface>("Category", CategorySchema);

export default Category;