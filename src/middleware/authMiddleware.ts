import dotenv from "dotenv";
dotenv.config();
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY || "";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")?.[1];
  if (!token) {
    return res.status(403).json({ message: "Missing Token" });
  }
  try {
    const isTokenValid = await jwt.verify(token, JWT_SECRET_KEY);
    req.user = isTokenValid;
    return next();
  } catch (err) {
    return res.status(403).send({ message: "Invalid Token" });
  }
};

export { authMiddleware };
