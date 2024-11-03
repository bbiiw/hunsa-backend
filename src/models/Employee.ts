import mongoose, { Schema, Document } from "mongoose";
import { getCurrentTime } from "../config/timezone";

export interface IEmployee extends Document {
  username: string;
  email: string;
  password: string;
  description: string;
  imgSrc: string;
  status: "available" | "unavailable";
  createdAt: string;
  updatedAt: string;
}

const EmployeeSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    description: { type: String, default: "" },
    imgSrc: { type: String, default: "" },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
    createdAt: {
      type: String,
      default: getCurrentTime,
    },
    updatedAt: {
      type: String,
      default: getCurrentTime,
    },
  },
  {
    timestamps: false,
  },
);

export default mongoose.model<IEmployee>("Employee", EmployeeSchema);
