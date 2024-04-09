"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.verifyToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
const verifyToken = async (token) => {
    try {
        const decoded = await jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY);
        return decoded;
    }
    catch (err) {
        // You can throw the error or customize it based on your needs
        throw new Error("Invalid Token");
    }
};
exports.verifyToken = verifyToken;
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")?.[1];
    if (!token) {
        return res.status(403).json({ message: "Missing Token" });
    }
    try {
        // Use verifyToken instead of jwt.verify directly
        const decodedToken = await (0, exports.verifyToken)(token);
        req.user = decodedToken;
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Invalid Token" });
    }
};
exports.authMiddleware = authMiddleware;
