"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")?.[1];
    if (!token) {
        return res.status(403).json({ message: "Missing Token" });
    }
    try {
        const isTokenValid = await jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY);
        req.user = isTokenValid;
        return next();
    }
    catch (err) {
        return res.status(403).send({ message: "Invalid Token" });
    }
};
exports.authMiddleware = authMiddleware;
