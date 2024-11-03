import mongoose, { Schema, Document, Types } from "mongoose";
import { IEmployee } from "./Employee";
import { IService } from "./Service";
import { getCurrentTime, getDate, getHour } from "../config/timezone";

export interface IReservation extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: IService["_id"];
  employeeId: IEmployee["_id"];
  reservationDate: Date;
  reservationTime: string;
  status: "pending" | "confirm" | "cancel";
  createdAt: string;
  updatedAt: string;
}

const ReservationSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    reservationDate: {
      type: String,
      default: getDate,
      required: true,
    },
    reservationTime: {
      type: String,
      default: getHour,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirm", "cancel"],
      default: "pending",
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

export default mongoose.model<IReservation>("reservation", ReservationSchema);
