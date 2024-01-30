import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import User from '../models/user.model';

export interface AuthenticatedRequest extends Request {
  user?: mongoose.Schema.Types.ObjectId
}

const IsAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
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
      res.status(StatusCodes.NOT_FOUND).json({error: "Authorization denied. User not found."})
      return;
    }
    req.user = user?._id;
    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: "Session expired. Please login again to continue." });
  }
};

export default IsAuthenticated;
