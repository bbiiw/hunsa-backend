import mongoose, { Schema, Document } from "mongoose";
import { getCurrentTime } from "../config/timezone";

// Interface ที่กำหนดชนิดของข้อมูล model
export interface IService extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  imgSrc: string;
  createdAt: Date;
  updatedAt: Date;
}

// กำหนดโครงสร้างของเอกสาร mongodb
const ServiceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imgSrc: { type: String, required: true },
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

export default mongoose.model<IService>("Service", ServiceSchema);
