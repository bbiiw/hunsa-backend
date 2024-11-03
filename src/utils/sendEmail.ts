import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// กำหนดภูมิภาค (region)
const sesClient = new SESClient({ region: "ap-southeast-1" });

// ฟังก์ชันสำหรับส่งอีเมลยืนยันการจองพร้อมลิงก์ยกเลิก
export const sendEmail = async (reservation: any) => {
  const params = {
    Destination: {
      ToAddresses: [reservation.customerEmail], // ส่งอีเมลไปยังลูกค้า
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <h1>ยืนยันการจองคิว</h1>
            <p>ชื่อ: ${reservation.customerName}</p>
            <p>วันเวลาจอง: ${reservation.reservationDate} ${reservation.reservationTime}</p>
            <p>บริการ: ${reservation.serviceId}</p>
            <p>คุณสามารถยกเลิกการจองได้โดยคลิกที่ลิงก์ด้านล่าง:</p>
            <a href="http://yourdomain.com/api/reservations/${reservation._id}/cancel">ยกเลิกการจอง</a>
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "ยืนยันการจองคิว",
      },
    },
    Source: "your-verified-email@example.com", // อีเมลที่คุณยืนยันใน AWS SES
  };

  // ส่งอีเมล
  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Email sent:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
