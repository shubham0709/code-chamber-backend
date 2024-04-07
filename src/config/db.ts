import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connection = mongoose.connect(process.env.DB_CONNECTION_STRING || "");

export { connection };
