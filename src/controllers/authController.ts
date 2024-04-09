import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserModel, userLoginStructure, userSignupStructure } from "../models/user";
import { authMiddleware } from "../middleware/authMiddleware";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";

const authController = express.Router();

authController.post("/login", async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const verifySchema = userLoginStructure.safeParse({
    email,
    password,
  });
  if (!verifySchema.success) {
    res.status(400).json(verifySchema);
    return;
  }
  const userExists = await UserModel.findOne({ email: email });
  if (userExists) {
    const passwordCheck = await bcrypt.compare(password, userExists.password);
    if (passwordCheck) {
      //generate a jwt token and send it back to user
      const payload = {
        firstName: userExists.firstName,
        lastName: userExists.lastName,
        email: userExists.email,
        _id: userExists._id,
      };
      const token = await jwt.sign(payload, JWT_SECRET_KEY);
      return res.status(200).json({
        user: payload,
        token: token,
        message: "Logged-in successfully",
      });
    }
  }
  return res.status(403).send("Invalid credentials");
});

authController.post("/signup", async (req: Request, res: Response) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    const verifySchema = userSignupStructure.safeParse({
      firstName,
      lastName,
      email,
      password,
    });

    if (!verifySchema.success) {
      res.status(400).send(verifySchema.error.issues.map((el) => el.message).join(" , "));
      return;
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).send("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    user.password = "";
    res.status(201).send({ messsage: "Signup successful", user });
  } catch (err) {
    res.status(500).send(err);
  }
});

authController.get("/get-all-users", async (req: Request, res: Response) => {
  const allUsers = await UserModel.find();
  res.status(200).send(allUsers);
});

authController.get("/get-user-by-id/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findOne({ id });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send(err);
  }
});

export { authController };
