import { Request, Response } from 'express';
import { getDate, getHour } from '../config/timezone';
import { sendEmail } from '../utils/sendEmail';
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { addReservation, getReservationEmployeeId, updateReservationStatus, cancelReservation } from '../services/ReservationService';

// ฟังก์ชันจองคิว
export const bookReservation = async (req: Request, res: Response) => {
  const { customerName, customerEmail, customerPhone, employeeId, serviceId, reservationDate, reservationTime } = req.body;

  try {
    const reservation = await addReservation(
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      employeeId,
      getDate(reservationDate),
      getHour(reservationTime)
    );

    // หากต้องการส่งอีเมลเมื่อจองสำเร็จ
    // await sendEmail(reservation);

    res.status(201).json({ message: 'จองคิวสำเร็จ', reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการจองคิว' });
  }
};

// แสดงข้อมูลการจองคิวที่ลูกค้าจองช่างคนนั้น (employeeId)
export const getReservationsByEmployee = async (req: Request, res: Response) => {
  const { employeeId } = req.params;

  try {
    const reservations = await getReservationEmployeeId(employeeId);

    if (!reservations) {
      return res.status(404).json({ message: 'ไม่พบการจองคิวสำหรับช่างคนนี้' });
    }

    res.status(200).json({ reservations });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง', error });
  }
};

// หลังลูกค้าเข้ารับบริการแล้ว ช่างเปลี่ยนสถานะการจองเป็น confirm
export const confirmReservation = async (req: Request, res: Response) => {
  const { reservationId } = req.params;

  try {
    const updatedReservation = await updateReservationStatus(reservationId, 'confirm');
    res.status(200).json({ message: 'อัปเดตสถานะสำเร็จ', updatedReservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ', error });
}
};

// ฟังก์ชันยกเลิกการจอง
export const cancelBooking = async (req: Request, res: Response) => {
  const { reservationId } = req.params;

  try {
    await cancelReservation(reservationId);
    res.status(200).json({ message: 'ยกเลิกการจองคิวสำเร็จ' });

    // หากต้องการส่ง SMS แจ้งเตือนเมื่อลูกค้าถูกยกเลิกการจอง
    // await sendCancelNotification(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการยกเลิกการจองคิว' });
  }
};

// สร้างฟังก์ชันสำหรับส่งการแจ้งเตือนผ่าน SNS
const snsClient = new SNSClient({ region: 'us-east-1' });

const sendCancelNotification = async (reservation: any) => {
  const params = {
    Message: `การจองของคุณถูกยกเลิก: ${reservation.id}`,
    PhoneNumber: reservation.customerPhone, // ใช้หมายเลขโทรศัพท์ของลูกค้าจากการจอง
  };

  try {
    const command = new PublishCommand(params);
    const result = await snsClient.send(command);
    console.log('SMS sent:', result);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

