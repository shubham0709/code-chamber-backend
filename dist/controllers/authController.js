"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const authMiddleware_1 = require("../middleware/authMiddleware");
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
const authController = express_1.default.Router();
exports.authController = authController;
authController.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const verifySchema = user_1.userLoginStructure.safeParse({
        email,
        password,
    });
    if (!verifySchema.success) {
        res.status(400).json(verifySchema);
        return;
    }
    const userExists = await user_1.UserModel.findOne({ email: email });
    if (userExists) {
        const passwordCheck = await bcrypt_1.default.compare(password, userExists.password);
        if (passwordCheck) {
            //generate a jwt token and send it back to user
            const payload = {
                firstName: userExists.firstName,
                lastName: userExists.lastName,
                email: userExists.email,
                _id: userExists._id,
            };
            const token = await jsonwebtoken_1.default.sign(payload, JWT_SECRET_KEY);
            return res.status(200).json({
                user: payload,
                token: token,
                message: "Logged-in successfully",
            });
        }
    }
    return res.status(403).send("Invalid credentials");
});
authController.post("/signup", async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;
        const verifySchema = user_1.userSignupStructure.safeParse({
            firstName,
            lastName,
            email,
            password,
        });
        if (!verifySchema.success) {
            res.status(400).send(verifySchema.error.issues.map((el) => el.message).join(" , "));
            return;
        }
        const userExists = await user_1.UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).send("User already exists");
        }
        const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const newUser = new user_1.UserModel({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        const user = await newUser.save();
        user.password = "";
        res.status(201).send({ messsage: "Signup successful", user });
    }
    catch (err) {
        res.status(500).send(err);
    }
});
authController.get("/get-all-users", async (req, res) => {
    const allUsers = await user_1.UserModel.find();
    res.status(200).send(allUsers);
});
authController.get("/get-user-by-id/:id", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await user_1.UserModel.findOne({ id });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        return res.status(200).send(user);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});
