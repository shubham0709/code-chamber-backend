import mongoose, { Schema } from "mongoose";
import { z } from "zod";
import { allModels } from ".";

const userLoginStructure = z.object({
  email: z.string().email(),
  password: z.string(),
});

const userSignupStructure = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model(allModels.User, userSchema);
export { UserModel, userLoginStructure, userSignupStructure };
