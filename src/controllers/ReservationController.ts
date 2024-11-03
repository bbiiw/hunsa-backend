import { Request, Response } from "express";
import Reservation, { IReservation } from "../models/Reservation";
import Service from "../models/Service";
import Employee from "../models/Employee";
import { getCurrentTime, getDate, getHour } from "../config/timezone";
import { sendEmail } from "../utils/sendEmail";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// ฟังก์ชันจองคิว
export const bookReservation = async (req: Request, res: Response) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    employeeId,
    serviceId,
    reservationDate,
    reservationTime,
  } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    const service = await Service.findById(serviceId);

    if (!employee || employee.status === "unavailable") {
      return res.status(400).json({ message: "ช่างไม่ว่างหรือไม่พบช่าง" });
    }

    if (!service) {
      return res.status(400).json({ message: "บริการไม่ถูกต้อง" });
    }

    // สร้างการจองคิวใหม่
    const reservation: IReservation = new Reservation({
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      employeeId,
      reservationDate: getDate(reservationDate),
      reservationTime: getHour(reservationTime),
    });

    await reservation.save();
    // await sendEmail(reservation);

    res.status(201).json({ message: "จองคิวสำเร็จ", reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการจองคิว" });
  }
};

// แสดงข้อมูลการจองคิวที่ลูกค้าจองช่างคนนั้น (employeeId)
export const getReservationsByEmployee = async (
  req: Request,
  res: Response,
) => {
  const { employeeId } = req.params;

  try {
    const reservations = await Reservation.find({ employeeId });

    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: "ไม่พบการจองคิวสำหรับช่างคนนี้" });
    }

    res.status(200).json({ reservations });
  } catch (error) {
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลการจอง", error });
  }
};

// หลังลูกค้าเข้ารับบริการแล้ว ช่างเปลี่ยนสถานะการจองเป็น confirm
export const updateReservationStatus = async (req: Request, res: Response) => {
  const { reservationId } = req.params;

  try {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "ไม่พบการจองคิว" });
    }

    reservation.status = "confirm";
    reservation.updatedAt = getCurrentTime();

    await reservation.save();

    res.status(200).json({ message: "อัปเดตสถานะสำเร็จ", reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตสถานะ", error });
  }
};

// สร้างฟังก์ชันสำหรับส่งการแจ้งเตือนผ่าน SNS
const snsClient = new SNSClient({ region: "ap-southeast-1" });

const sendCancelNotification = async (reservation: any) => {
  const params = {
    Message: `การจองของคุณถูกยกเลิก: ${reservation._id}`,
    PhoneNumber: reservation.customerPhone, // ใช้หมายเลขโทรศัพท์ของลูกค้าจากการจอง
  };

  try {
    const command = new PublishCommand(params);
    const result = await snsClient.send(command);
    console.log("SMS sent:", result);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

// ฟังก์ชันยกเลิกการจอง
export const cancelReservation = async (req: Request, res: Response) => {
  const { reservationId } = req.params;

  try {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "ไม่พบการจองคิว" });
    }

    reservation.status = "cancel";
    reservation.updatedAt = getCurrentTime();

    await reservation.save();
    // await sendCancelNotification(reservation);

    res.status(200).json({ message: "ยกเลิกการจองคิวสำเร็จ", reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการยกเลิกการจองคิว" });
  }
};
