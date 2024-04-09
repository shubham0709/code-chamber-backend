import dotenv from "dotenv";
dotenv.config();
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY || "";

export interface JwtPayload {
  firstName: string;
  lastName: string;
  email: string;
  _id: string;
  iat: number;
}

export const verifyToken = async (token: string): Promise<any> => {
  try {
    const decoded = await jwt.verify(token, JWT_SECRET_KEY);
    return decoded;
  } catch (err) {
    // You can throw the error or customize it based on your needs
    throw new Error("Invalid Token");
  }
};

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")?.[1];
  if (!token) {
    return res.status(403).json({ message: "Missing Token" });
  }
  try {
    // Use verifyToken instead of jwt.verify directly
    const decodedToken = await verifyToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

export { authMiddleware };
