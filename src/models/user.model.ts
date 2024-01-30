import mongoose, { Schema, model } from "mongoose";

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

export interface UserInterface extends mongoose.Document {
    name: string
    email: string
    password: string
    role: UserRole
}

const UserSchema = new Schema<UserInterface>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        required: true
    }
});

const User = model<UserInterface>("User", UserSchema);

export default User;